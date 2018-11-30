import { Operation } from "apollo-link";

const op: Operation = {
  variables: {
    name: "User 1",
    id: 5,
    dateOfBirth: "1/1/18",
    address: "GraphQL Lane",
    version: 1
  },
  operationName: "updateUser",
  query: {
    kind: "Document",
    definitions: [{
      kind: "OperationDefinition",
      selectionSet: {} as any,
      operation: "mutation",
      name: {
        kind: "Name",
        value: "updateUser"
      }
    }]
  },
  extensions: {} as any,
  setContext: {} as any,
  getContext: {} as any,
  toKey: {} as any
};

const opWithDirective: Operation = {
  variables: {
    name: "User 1",
    dateOfBirth: "Fri Nov 30 2018 09:43:22 GMT+0000",
    id: "1",
    version: 3
  },
  operationName: "updateUser",
  query: {
    kind: "Document",
    definitions: [{
      kind: "OperationDefinition",
      operation: "mutation",
      name: {
        kind: "Name",
        value: "updateUser"
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [{
          kind: "Field",
          name: {
            kind: "Name",
            value: "updateUser"
          },
          directives: [{
            kind: "Directive",
            name: {
              kind: "Name",
              value: "noSquash"
            },
            arguments: []
          }]
        }]
      }
    }]
  },
  extensions: {} as any,
  setContext: {} as any,
  getContext: {} as any,
  toKey: {} as any
};

const opWithDifferentQuery: Operation = {
  variables: {
    name: "User 1",
    id: 5,
    dateOfBirth: "1/1/18",
    address: "GraphQL Lane",
    version: 1
  },
  operationName: "createUser",
  query: {
    kind: "Document",
    definitions: [{
      kind: "OperationDefinition",
      selectionSet: {} as any,
      operation: "mutation",
      name: {
        kind: "Name",
        value: "createUser"
      }
    }]
  },
  extensions: {} as any,
  setContext: {} as any,
  getContext: {} as any,
  toKey: {} as any
};

export { op, opWithDifferentQuery, opWithDirective };