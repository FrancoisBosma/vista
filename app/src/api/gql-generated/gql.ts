/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query concept($conceptName: String!) {\n    getConcept(name: $conceptName) {\n      arguments {\n        name\n        capacity\n      }\n      composition {\n        subConcepts {\n          concept {\n            name\n            composition {\n              subConcepts {\n                concept {\n                  name\n                }\n              }\n            }\n          }\n          xy\n        }\n        connections {\n          sourceCustomID\n          sourceArgumentType {\n            name\n          }\n          targetConceptType\n          targetConceptCustomID\n          targetConceptArgumentType {\n            name\n          }\n        }\n      }\n    }\n  }\n": types.ConceptDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query concept($conceptName: String!) {\n    getConcept(name: $conceptName) {\n      arguments {\n        name\n        capacity\n      }\n      composition {\n        subConcepts {\n          concept {\n            name\n            composition {\n              subConcepts {\n                concept {\n                  name\n                }\n              }\n            }\n          }\n          xy\n        }\n        connections {\n          sourceCustomID\n          sourceArgumentType {\n            name\n          }\n          targetConceptType\n          targetConceptCustomID\n          targetConceptArgumentType {\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query concept($conceptName: String!) {\n    getConcept(name: $conceptName) {\n      arguments {\n        name\n        capacity\n      }\n      composition {\n        subConcepts {\n          concept {\n            name\n            composition {\n              subConcepts {\n                concept {\n                  name\n                }\n              }\n            }\n          }\n          xy\n        }\n        connections {\n          sourceCustomID\n          sourceArgumentType {\n            name\n          }\n          targetConceptType\n          targetConceptCustomID\n          targetConceptArgumentType {\n            name\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;