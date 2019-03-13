import { ApolloLink, Operation } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { conflictLink } from "../conflicts";
import { DataSyncConfig } from "../config";
import { createAuthLink } from "./AuthLink";
import { AuditLoggingLink } from "./AuditLoggingLink";
import { MetricsBuilder } from "@aerogear/core";
import { LocalDirectiveFilterLink } from "./LocalDirectiveFilterLink";
import { createUploadLink } from "apollo-upload-client";
import { isMutation, isOnlineOnly, isSubscription } from "../utils/helpers";
import { defaultWebSocketLink } from "./WebsocketLink";
import { OfflineLink } from "./OfflineLink";
import { NetworkStatus } from "../offline";
import { extensionsLink } from "./ExtensionsLink";

/**
 * Default Apollo Link
 * Combines HTTP and WebSocket links
 */
export const defaultLink = async (config: DataSyncConfig) => {
  let link = await defaultHttpLinks(config);
  if (config.wsUrl) {
    const wsLink = defaultWebSocketLink(config, { uri: config.wsUrl });
    link = ApolloLink.split(isSubscription, wsLink, link);
  }
  return link;
};

/**
 * Default HTTP Apollo Links
 * Provides out of the box functionality for:
 *
 * - Offline/Online queue
 * - Conflict resolution
 * - Error handling
 * - Audit logging
 */
export const defaultHttpLinks = async (config: DataSyncConfig): Promise<ApolloLink> => {
  const offlineLink = await createOfflineLink(config);
  const links: ApolloLink[] = [extensionsLink, offlineLink];

  if (config.auditLogging) {
    links.push(await createAuditLoggingLink());
  }

  if (config.conflictStrategy) {
    links.push(conflictLink(config));
  }

  if (config.authContextProvider) {
    links.push(createAuthLink(config));
  }

  if (config.fileUpload) {
    links.push(createUploadLink({
      uri: config.httpUrl,
      includeExtensions: config.auditLogging
    }));
  } else {
    const httpLink = new HttpLink({
      uri: config.httpUrl,
      includeExtensions: config.auditLogging
    }) as ApolloLink;
    links.push(httpLink);
  }

  return ApolloLink.from(links);
};

const createAuditLoggingLink = async (): Promise<AuditLoggingLink> => {
  const metricsBuilder: MetricsBuilder = new MetricsBuilder();
  const metricsPayload: {
    [key: string]: any;
  } = {};
  const metrics = metricsBuilder.buildDefaultMetrics();
  for (const metric of metrics) {
    metricsPayload[metric.identifier] = await metric.collect();
  }
  return new AuditLoggingLink(metricsBuilder.getClientId(), metricsPayload);
};

async function createOfflineLink(config: DataSyncConfig) {
  const offlineLink = new OfflineLink({
    storage: config.storage,
    storageKey: config.mutationsQueueName,
    listener: config.offlineQueueListener,
    networkStatus: config.networkStatus as NetworkStatus,
    conflictStateProvider: config.conflictStateProvider
  });
  await offlineLink.forwardOnOnline();
  const mutationOfflineLink = ApolloLink.split((op: Operation) => {
    return isMutation(op) && !isOnlineOnly(op);
  }, offlineLink);

  const localFilterLink = new LocalDirectiveFilterLink();

  return ApolloLink.from([mutationOfflineLink, localFilterLink]);
}
