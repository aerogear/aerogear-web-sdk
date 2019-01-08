import { onError } from "apollo-link-error";
import { GraphQLError } from "graphql";
import { DataSyncConfig } from "../config";
import { ApolloLink } from "apollo-link";
import { ConflictResolutionData } from "./ConflictResolutionData";

export const conflictLink = (config: DataSyncConfig): ApolloLink => {
  /**
  * Fetch conflict data from the errors returned from the server
  * @param graphQLErrors array of errors to retrieve conflicted data from
  */
  const getConflictData = (graphQLErrors?: ReadonlyArray<GraphQLError>): ConflictResolutionData => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions) {
          // TODO need to add flag to check if conflict was resolved on the server
          if (err.extensions.exception.conflictInfo) {
            return err.extensions.exception.conflictInfo;
          }
        }
      }
    }
  };

  return onError(({ response, operation, forward, graphQLErrors }) => {
    const data = getConflictData(graphQLErrors);
    if (data && config.conflictStrategy && config.conflictStateProvider) {
      let resolvedConflict;
      if (data.resolvedOnServer) {
        resolvedConflict = data.serverData;
        if (response) {
          // 🍴 eat error
          response.errors = undefined;
          // Set data to resolved state
          response.data = resolvedConflict;
        }
        if (config.conflictListener) {
          config.conflictListener.conflictOccurred(operation.operationName,
            resolvedConflict, data.serverData, data.clientData);
        }
      } else {
        // resolve on client
        resolvedConflict = config.conflictStrategy(operation.operationName, data.serverData, data.clientData);
        resolvedConflict = config.conflictStateProvider.nextState(resolvedConflict);
        operation.variables = resolvedConflict;
        if (config.conflictListener) {
          config.conflictListener.conflictOccurred(operation.operationName,
            resolvedConflict, data.serverData, data.clientData);
        }
        return forward(operation);
      }
    }
  });
};
