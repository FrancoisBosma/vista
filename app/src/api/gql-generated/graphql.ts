/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The DateTime scalar type represents date and time as a string in RFC3339 format.
   * For example: "1985-04-12T23:20:50.52Z" represents 20 minutes and 50.52 seconds after the 23rd hour of April 12th, 1985 in UTC.
   */
  DateTime: any;
  /**
   * The Int64 scalar type represents a signed 64‐bit numeric non‐fractional value.
   * Int64 can represent values in range [-(2^63),(2^63 - 1)].
   */
  Int64: any;
};

export type AddConceptArgumentTypeInput = {
  capacity: Scalars['String'];
  name: Scalars['String'];
  ownerConcept: ConceptRef;
};

export type AddConceptArgumentTypePayload = {
  __typename?: 'AddConceptArgumentTypePayload';
  conceptArgumentType?: Maybe<Array<Maybe<ConceptArgumentType>>>;
  numUids?: Maybe<Scalars['Int']>;
};


export type AddConceptArgumentTypePayloadConceptArgumentTypeArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptArgumentTypeOrder>;
};

export type AddConceptCompositionInput = {
  connections: Array<SubConceptConnectionRef>;
  ownerConcept: ConceptRef;
  subConcepts: Array<SubConceptRef>;
};

export type AddConceptCompositionPayload = {
  __typename?: 'AddConceptCompositionPayload';
  conceptComposition?: Maybe<Array<Maybe<ConceptComposition>>>;
  numUids?: Maybe<Scalars['Int']>;
};


export type AddConceptCompositionPayloadConceptCompositionArgs = {
  filter?: InputMaybe<ConceptCompositionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type AddConceptInput = {
  arguments: Array<ConceptArgumentTypeRef>;
  composition?: InputMaybe<ConceptCompositionRef>;
  name: Scalars['String'];
};

export type AddConceptPayload = {
  __typename?: 'AddConceptPayload';
  concept?: Maybe<Array<Maybe<Concept>>>;
  numUids?: Maybe<Scalars['Int']>;
};


export type AddConceptPayloadConceptArgs = {
  filter?: InputMaybe<ConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptOrder>;
};

export type AddSubConceptConnectionInput = {
  ownerConceptComposition: ConceptCompositionRef;
  sourceArgumentType: ConceptArgumentTypeRef;
  sourceCustomID: Scalars['String'];
  targetConceptArgumentType?: InputMaybe<ConceptArgumentTypeRef>;
  targetConceptCustomID?: InputMaybe<Scalars['String']>;
  targetConceptType: TargetConceptType;
};

export type AddSubConceptConnectionPayload = {
  __typename?: 'AddSubConceptConnectionPayload';
  numUids?: Maybe<Scalars['Int']>;
  subConceptConnection?: Maybe<Array<Maybe<SubConceptConnection>>>;
};


export type AddSubConceptConnectionPayloadSubConceptConnectionArgs = {
  filter?: InputMaybe<SubConceptConnectionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptConnectionOrder>;
};

export type AddSubConceptInput = {
  concept: ConceptRef;
  ownerConceptComposition: ConceptCompositionRef;
  wh?: InputMaybe<Scalars['String']>;
  xy?: InputMaybe<Scalars['String']>;
};

export type AddSubConceptPayload = {
  __typename?: 'AddSubConceptPayload';
  numUids?: Maybe<Scalars['Int']>;
  subConcept?: Maybe<Array<Maybe<SubConcept>>>;
};


export type AddSubConceptPayloadSubConceptArgs = {
  filter?: InputMaybe<SubConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptOrder>;
};

export type AuthRule = {
  and?: InputMaybe<Array<InputMaybe<AuthRule>>>;
  not?: InputMaybe<AuthRule>;
  or?: InputMaybe<Array<InputMaybe<AuthRule>>>;
  rule?: InputMaybe<Scalars['String']>;
};

export type Concept = {
  __typename?: 'Concept';
  arguments: Array<ConceptArgumentType>;
  argumentsAggregate?: Maybe<ConceptArgumentTypeAggregateResult>;
  composition?: Maybe<ConceptComposition>;
  name: Scalars['String'];
};


export type ConceptArgumentsArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptArgumentTypeOrder>;
};


export type ConceptArgumentsAggregateArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
};


export type ConceptCompositionArgs = {
  filter?: InputMaybe<ConceptCompositionFilter>;
};

export type ConceptAggregateResult = {
  __typename?: 'ConceptAggregateResult';
  count?: Maybe<Scalars['Int']>;
  nameMax?: Maybe<Scalars['String']>;
  nameMin?: Maybe<Scalars['String']>;
};

export type ConceptArgumentType = {
  __typename?: 'ConceptArgumentType';
  capacity: Scalars['String'];
  name: Scalars['String'];
  ownerConcept: Concept;
};


export type ConceptArgumentTypeOwnerConceptArgs = {
  filter?: InputMaybe<ConceptFilter>;
};

export type ConceptArgumentTypeAggregateResult = {
  __typename?: 'ConceptArgumentTypeAggregateResult';
  capacityMax?: Maybe<Scalars['String']>;
  capacityMin?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
  nameMax?: Maybe<Scalars['String']>;
  nameMin?: Maybe<Scalars['String']>;
};

export type ConceptArgumentTypeFilter = {
  and?: InputMaybe<Array<InputMaybe<ConceptArgumentTypeFilter>>>;
  has?: InputMaybe<Array<InputMaybe<ConceptArgumentTypeHasFilter>>>;
  name?: InputMaybe<StringHashFilter>;
  not?: InputMaybe<ConceptArgumentTypeFilter>;
  or?: InputMaybe<Array<InputMaybe<ConceptArgumentTypeFilter>>>;
};

export enum ConceptArgumentTypeHasFilter {
  Capacity = 'capacity',
  Name = 'name',
  OwnerConcept = 'ownerConcept'
}

export type ConceptArgumentTypeOrder = {
  asc?: InputMaybe<ConceptArgumentTypeOrderable>;
  desc?: InputMaybe<ConceptArgumentTypeOrderable>;
  then?: InputMaybe<ConceptArgumentTypeOrder>;
};

export enum ConceptArgumentTypeOrderable {
  Capacity = 'capacity',
  Name = 'name'
}

export type ConceptArgumentTypePatch = {
  capacity?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  ownerConcept?: InputMaybe<ConceptRef>;
};

export type ConceptArgumentTypeRef = {
  capacity?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  ownerConcept?: InputMaybe<ConceptRef>;
};

export type ConceptComposition = {
  __typename?: 'ConceptComposition';
  connections: Array<SubConceptConnection>;
  connectionsAggregate?: Maybe<SubConceptConnectionAggregateResult>;
  id: Scalars['ID'];
  ownerConcept: Concept;
  subConcepts: Array<SubConcept>;
  subConceptsAggregate?: Maybe<SubConceptAggregateResult>;
};


export type ConceptCompositionConnectionsArgs = {
  filter?: InputMaybe<SubConceptConnectionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptConnectionOrder>;
};


export type ConceptCompositionConnectionsAggregateArgs = {
  filter?: InputMaybe<SubConceptConnectionFilter>;
};


export type ConceptCompositionOwnerConceptArgs = {
  filter?: InputMaybe<ConceptFilter>;
};


export type ConceptCompositionSubConceptsArgs = {
  filter?: InputMaybe<SubConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptOrder>;
};


export type ConceptCompositionSubConceptsAggregateArgs = {
  filter?: InputMaybe<SubConceptFilter>;
};

export type ConceptCompositionAggregateResult = {
  __typename?: 'ConceptCompositionAggregateResult';
  count?: Maybe<Scalars['Int']>;
};

export type ConceptCompositionFilter = {
  and?: InputMaybe<Array<InputMaybe<ConceptCompositionFilter>>>;
  has?: InputMaybe<Array<InputMaybe<ConceptCompositionHasFilter>>>;
  id?: InputMaybe<Array<Scalars['ID']>>;
  not?: InputMaybe<ConceptCompositionFilter>;
  or?: InputMaybe<Array<InputMaybe<ConceptCompositionFilter>>>;
};

export enum ConceptCompositionHasFilter {
  Connections = 'connections',
  OwnerConcept = 'ownerConcept',
  SubConcepts = 'subConcepts'
}

export type ConceptCompositionPatch = {
  connections?: InputMaybe<Array<SubConceptConnectionRef>>;
  ownerConcept?: InputMaybe<ConceptRef>;
  subConcepts?: InputMaybe<Array<SubConceptRef>>;
};

export type ConceptCompositionRef = {
  connections?: InputMaybe<Array<SubConceptConnectionRef>>;
  id?: InputMaybe<Scalars['ID']>;
  ownerConcept?: InputMaybe<ConceptRef>;
  subConcepts?: InputMaybe<Array<SubConceptRef>>;
};

export type ConceptFilter = {
  and?: InputMaybe<Array<InputMaybe<ConceptFilter>>>;
  has?: InputMaybe<Array<InputMaybe<ConceptHasFilter>>>;
  name?: InputMaybe<StringHashFilter>;
  not?: InputMaybe<ConceptFilter>;
  or?: InputMaybe<Array<InputMaybe<ConceptFilter>>>;
};

export enum ConceptHasFilter {
  Arguments = 'arguments',
  Composition = 'composition',
  Name = 'name'
}

export type ConceptOrder = {
  asc?: InputMaybe<ConceptOrderable>;
  desc?: InputMaybe<ConceptOrderable>;
  then?: InputMaybe<ConceptOrder>;
};

export enum ConceptOrderable {
  Name = 'name'
}

export type ConceptPatch = {
  arguments?: InputMaybe<Array<ConceptArgumentTypeRef>>;
  composition?: InputMaybe<ConceptCompositionRef>;
  name?: InputMaybe<Scalars['String']>;
};

export type ConceptRef = {
  arguments?: InputMaybe<Array<ConceptArgumentTypeRef>>;
  composition?: InputMaybe<ConceptCompositionRef>;
  name?: InputMaybe<Scalars['String']>;
};

export type ContainsFilter = {
  point?: InputMaybe<PointRef>;
  polygon?: InputMaybe<PolygonRef>;
};

export type CustomHttp = {
  body?: InputMaybe<Scalars['String']>;
  forwardHeaders?: InputMaybe<Array<Scalars['String']>>;
  graphql?: InputMaybe<Scalars['String']>;
  introspectionHeaders?: InputMaybe<Array<Scalars['String']>>;
  method: HttpMethod;
  mode?: InputMaybe<Mode>;
  secretHeaders?: InputMaybe<Array<Scalars['String']>>;
  skipIntrospection?: InputMaybe<Scalars['Boolean']>;
  url: Scalars['String'];
};

export type DateTimeFilter = {
  between?: InputMaybe<DateTimeRange>;
  eq?: InputMaybe<Scalars['DateTime']>;
  ge?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  le?: InputMaybe<Scalars['DateTime']>;
  lt?: InputMaybe<Scalars['DateTime']>;
};

export type DateTimeRange = {
  max: Scalars['DateTime'];
  min: Scalars['DateTime'];
};

export type DeleteConceptArgumentTypePayload = {
  __typename?: 'DeleteConceptArgumentTypePayload';
  conceptArgumentType?: Maybe<Array<Maybe<ConceptArgumentType>>>;
  msg?: Maybe<Scalars['String']>;
  numUids?: Maybe<Scalars['Int']>;
};


export type DeleteConceptArgumentTypePayloadConceptArgumentTypeArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptArgumentTypeOrder>;
};

export type DeleteConceptCompositionPayload = {
  __typename?: 'DeleteConceptCompositionPayload';
  conceptComposition?: Maybe<Array<Maybe<ConceptComposition>>>;
  msg?: Maybe<Scalars['String']>;
  numUids?: Maybe<Scalars['Int']>;
};


export type DeleteConceptCompositionPayloadConceptCompositionArgs = {
  filter?: InputMaybe<ConceptCompositionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type DeleteConceptPayload = {
  __typename?: 'DeleteConceptPayload';
  concept?: Maybe<Array<Maybe<Concept>>>;
  msg?: Maybe<Scalars['String']>;
  numUids?: Maybe<Scalars['Int']>;
};


export type DeleteConceptPayloadConceptArgs = {
  filter?: InputMaybe<ConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptOrder>;
};

export type DeleteSubConceptConnectionPayload = {
  __typename?: 'DeleteSubConceptConnectionPayload';
  msg?: Maybe<Scalars['String']>;
  numUids?: Maybe<Scalars['Int']>;
  subConceptConnection?: Maybe<Array<Maybe<SubConceptConnection>>>;
};


export type DeleteSubConceptConnectionPayloadSubConceptConnectionArgs = {
  filter?: InputMaybe<SubConceptConnectionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptConnectionOrder>;
};

export type DeleteSubConceptPayload = {
  __typename?: 'DeleteSubConceptPayload';
  msg?: Maybe<Scalars['String']>;
  numUids?: Maybe<Scalars['Int']>;
  subConcept?: Maybe<Array<Maybe<SubConcept>>>;
};


export type DeleteSubConceptPayloadSubConceptArgs = {
  filter?: InputMaybe<SubConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptOrder>;
};

export type DgraphDefault = {
  value?: InputMaybe<Scalars['String']>;
};

export enum DgraphIndex {
  Bool = 'bool',
  Day = 'day',
  Exact = 'exact',
  Float = 'float',
  Fulltext = 'fulltext',
  Geo = 'geo',
  Hash = 'hash',
  Hour = 'hour',
  Int = 'int',
  Int64 = 'int64',
  Month = 'month',
  Regexp = 'regexp',
  Term = 'term',
  Trigram = 'trigram',
  Year = 'year'
}

export type FloatFilter = {
  between?: InputMaybe<FloatRange>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
};

export type FloatRange = {
  max: Scalars['Float'];
  min: Scalars['Float'];
};

export type GenerateMutationParams = {
  add?: InputMaybe<Scalars['Boolean']>;
  delete?: InputMaybe<Scalars['Boolean']>;
  update?: InputMaybe<Scalars['Boolean']>;
};

export type GenerateQueryParams = {
  aggregate?: InputMaybe<Scalars['Boolean']>;
  get?: InputMaybe<Scalars['Boolean']>;
  password?: InputMaybe<Scalars['Boolean']>;
  query?: InputMaybe<Scalars['Boolean']>;
};

export enum HttpMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT'
}

export type Int64Filter = {
  between?: InputMaybe<Int64Range>;
  eq?: InputMaybe<Scalars['Int64']>;
  ge?: InputMaybe<Scalars['Int64']>;
  gt?: InputMaybe<Scalars['Int64']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int64']>>>;
  le?: InputMaybe<Scalars['Int64']>;
  lt?: InputMaybe<Scalars['Int64']>;
};

export type Int64Range = {
  max: Scalars['Int64'];
  min: Scalars['Int64'];
};

export type IntFilter = {
  between?: InputMaybe<IntRange>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
};

export type IntRange = {
  max: Scalars['Int'];
  min: Scalars['Int'];
};

export type IntersectsFilter = {
  multiPolygon?: InputMaybe<MultiPolygonRef>;
  polygon?: InputMaybe<PolygonRef>;
};

export enum Mode {
  Batch = 'BATCH',
  Single = 'SINGLE'
}

export type MultiPolygon = {
  __typename?: 'MultiPolygon';
  polygons: Array<Polygon>;
};

export type MultiPolygonRef = {
  polygons: Array<PolygonRef>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addConcept?: Maybe<AddConceptPayload>;
  addConceptArgumentType?: Maybe<AddConceptArgumentTypePayload>;
  addConceptComposition?: Maybe<AddConceptCompositionPayload>;
  addSubConcept?: Maybe<AddSubConceptPayload>;
  addSubConceptConnection?: Maybe<AddSubConceptConnectionPayload>;
  deleteConcept?: Maybe<DeleteConceptPayload>;
  deleteConceptArgumentType?: Maybe<DeleteConceptArgumentTypePayload>;
  deleteConceptComposition?: Maybe<DeleteConceptCompositionPayload>;
  deleteSubConcept?: Maybe<DeleteSubConceptPayload>;
  deleteSubConceptConnection?: Maybe<DeleteSubConceptConnectionPayload>;
  updateConcept?: Maybe<UpdateConceptPayload>;
  updateConceptArgumentType?: Maybe<UpdateConceptArgumentTypePayload>;
  updateConceptComposition?: Maybe<UpdateConceptCompositionPayload>;
  updateSubConcept?: Maybe<UpdateSubConceptPayload>;
  updateSubConceptConnection?: Maybe<UpdateSubConceptConnectionPayload>;
};


export type MutationAddConceptArgs = {
  input: Array<AddConceptInput>;
  upsert?: InputMaybe<Scalars['Boolean']>;
};


export type MutationAddConceptArgumentTypeArgs = {
  input: Array<AddConceptArgumentTypeInput>;
  upsert?: InputMaybe<Scalars['Boolean']>;
};


export type MutationAddConceptCompositionArgs = {
  input: Array<AddConceptCompositionInput>;
};


export type MutationAddSubConceptArgs = {
  input: Array<AddSubConceptInput>;
};


export type MutationAddSubConceptConnectionArgs = {
  input: Array<AddSubConceptConnectionInput>;
};


export type MutationDeleteConceptArgs = {
  filter: ConceptFilter;
};


export type MutationDeleteConceptArgumentTypeArgs = {
  filter: ConceptArgumentTypeFilter;
};


export type MutationDeleteConceptCompositionArgs = {
  filter: ConceptCompositionFilter;
};


export type MutationDeleteSubConceptArgs = {
  filter: SubConceptFilter;
};


export type MutationDeleteSubConceptConnectionArgs = {
  filter: SubConceptConnectionFilter;
};


export type MutationUpdateConceptArgs = {
  input: UpdateConceptInput;
};


export type MutationUpdateConceptArgumentTypeArgs = {
  input: UpdateConceptArgumentTypeInput;
};


export type MutationUpdateConceptCompositionArgs = {
  input: UpdateConceptCompositionInput;
};


export type MutationUpdateSubConceptArgs = {
  input: UpdateSubConceptInput;
};


export type MutationUpdateSubConceptConnectionArgs = {
  input: UpdateSubConceptConnectionInput;
};

export type NearFilter = {
  coordinate: PointRef;
  distance: Scalars['Float'];
};

export type Point = {
  __typename?: 'Point';
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type PointGeoFilter = {
  near?: InputMaybe<NearFilter>;
  within?: InputMaybe<WithinFilter>;
};

export type PointList = {
  __typename?: 'PointList';
  points: Array<Point>;
};

export type PointListRef = {
  points: Array<PointRef>;
};

export type PointRef = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type Polygon = {
  __typename?: 'Polygon';
  coordinates: Array<PointList>;
};

export type PolygonGeoFilter = {
  contains?: InputMaybe<ContainsFilter>;
  intersects?: InputMaybe<IntersectsFilter>;
  near?: InputMaybe<NearFilter>;
  within?: InputMaybe<WithinFilter>;
};

export type PolygonRef = {
  coordinates: Array<PointListRef>;
};

export type Query = {
  __typename?: 'Query';
  aggregateConcept?: Maybe<ConceptAggregateResult>;
  aggregateConceptArgumentType?: Maybe<ConceptArgumentTypeAggregateResult>;
  aggregateConceptComposition?: Maybe<ConceptCompositionAggregateResult>;
  aggregateSubConcept?: Maybe<SubConceptAggregateResult>;
  aggregateSubConceptConnection?: Maybe<SubConceptConnectionAggregateResult>;
  getConcept?: Maybe<Concept>;
  getConceptArgumentType?: Maybe<ConceptArgumentType>;
  getConceptComposition?: Maybe<ConceptComposition>;
  getSubConcept?: Maybe<SubConcept>;
  getSubConceptConnection?: Maybe<SubConceptConnection>;
  queryConcept?: Maybe<Array<Maybe<Concept>>>;
  queryConceptArgumentType?: Maybe<Array<Maybe<ConceptArgumentType>>>;
  queryConceptComposition?: Maybe<Array<Maybe<ConceptComposition>>>;
  querySubConcept?: Maybe<Array<Maybe<SubConcept>>>;
  querySubConceptConnection?: Maybe<Array<Maybe<SubConceptConnection>>>;
};


export type QueryAggregateConceptArgs = {
  filter?: InputMaybe<ConceptFilter>;
};


export type QueryAggregateConceptArgumentTypeArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
};


export type QueryAggregateConceptCompositionArgs = {
  filter?: InputMaybe<ConceptCompositionFilter>;
};


export type QueryAggregateSubConceptArgs = {
  filter?: InputMaybe<SubConceptFilter>;
};


export type QueryAggregateSubConceptConnectionArgs = {
  filter?: InputMaybe<SubConceptConnectionFilter>;
};


export type QueryGetConceptArgs = {
  name: Scalars['String'];
};


export type QueryGetConceptArgumentTypeArgs = {
  name: Scalars['String'];
};


export type QueryGetConceptCompositionArgs = {
  id: Scalars['ID'];
};


export type QueryGetSubConceptArgs = {
  id: Scalars['ID'];
};


export type QueryGetSubConceptConnectionArgs = {
  id: Scalars['ID'];
};


export type QueryQueryConceptArgs = {
  filter?: InputMaybe<ConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptOrder>;
};


export type QueryQueryConceptArgumentTypeArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptArgumentTypeOrder>;
};


export type QueryQueryConceptCompositionArgs = {
  filter?: InputMaybe<ConceptCompositionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryQuerySubConceptArgs = {
  filter?: InputMaybe<SubConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptOrder>;
};


export type QueryQuerySubConceptConnectionArgs = {
  filter?: InputMaybe<SubConceptConnectionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptConnectionOrder>;
};

export type StringExactFilter = {
  between?: InputMaybe<StringRange>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
};

export type StringFullTextFilter = {
  alloftext?: InputMaybe<Scalars['String']>;
  anyoftext?: InputMaybe<Scalars['String']>;
};

export type StringHashFilter = {
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type StringRange = {
  max: Scalars['String'];
  min: Scalars['String'];
};

export type StringRegExpFilter = {
  regexp?: InputMaybe<Scalars['String']>;
};

export type StringTermFilter = {
  allofterms?: InputMaybe<Scalars['String']>;
  anyofterms?: InputMaybe<Scalars['String']>;
};

export type SubConcept = {
  __typename?: 'SubConcept';
  concept: Concept;
  id: Scalars['ID'];
  ownerConceptComposition: ConceptComposition;
  wh?: Maybe<Scalars['String']>;
  xy?: Maybe<Scalars['String']>;
};


export type SubConceptConceptArgs = {
  filter?: InputMaybe<ConceptFilter>;
};


export type SubConceptOwnerConceptCompositionArgs = {
  filter?: InputMaybe<ConceptCompositionFilter>;
};

export type SubConceptAggregateResult = {
  __typename?: 'SubConceptAggregateResult';
  count?: Maybe<Scalars['Int']>;
  whMax?: Maybe<Scalars['String']>;
  whMin?: Maybe<Scalars['String']>;
  xyMax?: Maybe<Scalars['String']>;
  xyMin?: Maybe<Scalars['String']>;
};

export type SubConceptConnection = {
  __typename?: 'SubConceptConnection';
  id: Scalars['ID'];
  ownerConceptComposition: ConceptComposition;
  sourceArgumentType: ConceptArgumentType;
  sourceCustomID: Scalars['String'];
  targetConceptArgumentType?: Maybe<ConceptArgumentType>;
  targetConceptCustomID?: Maybe<Scalars['String']>;
  targetConceptType: TargetConceptType;
};


export type SubConceptConnectionOwnerConceptCompositionArgs = {
  filter?: InputMaybe<ConceptCompositionFilter>;
};


export type SubConceptConnectionSourceArgumentTypeArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
};


export type SubConceptConnectionTargetConceptArgumentTypeArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
};

export type SubConceptConnectionAggregateResult = {
  __typename?: 'SubConceptConnectionAggregateResult';
  count?: Maybe<Scalars['Int']>;
  sourceCustomIDMax?: Maybe<Scalars['String']>;
  sourceCustomIDMin?: Maybe<Scalars['String']>;
  targetConceptCustomIDMax?: Maybe<Scalars['String']>;
  targetConceptCustomIDMin?: Maybe<Scalars['String']>;
};

export type SubConceptConnectionFilter = {
  and?: InputMaybe<Array<InputMaybe<SubConceptConnectionFilter>>>;
  has?: InputMaybe<Array<InputMaybe<SubConceptConnectionHasFilter>>>;
  id?: InputMaybe<Array<Scalars['ID']>>;
  not?: InputMaybe<SubConceptConnectionFilter>;
  or?: InputMaybe<Array<InputMaybe<SubConceptConnectionFilter>>>;
};

export enum SubConceptConnectionHasFilter {
  OwnerConceptComposition = 'ownerConceptComposition',
  SourceArgumentType = 'sourceArgumentType',
  SourceCustomId = 'sourceCustomID',
  TargetConceptArgumentType = 'targetConceptArgumentType',
  TargetConceptCustomId = 'targetConceptCustomID',
  TargetConceptType = 'targetConceptType'
}

export type SubConceptConnectionOrder = {
  asc?: InputMaybe<SubConceptConnectionOrderable>;
  desc?: InputMaybe<SubConceptConnectionOrderable>;
  then?: InputMaybe<SubConceptConnectionOrder>;
};

export enum SubConceptConnectionOrderable {
  SourceCustomId = 'sourceCustomID',
  TargetConceptCustomId = 'targetConceptCustomID'
}

export type SubConceptConnectionPatch = {
  ownerConceptComposition?: InputMaybe<ConceptCompositionRef>;
  sourceArgumentType?: InputMaybe<ConceptArgumentTypeRef>;
  sourceCustomID?: InputMaybe<Scalars['String']>;
  targetConceptArgumentType?: InputMaybe<ConceptArgumentTypeRef>;
  targetConceptCustomID?: InputMaybe<Scalars['String']>;
  targetConceptType?: InputMaybe<TargetConceptType>;
};

export type SubConceptConnectionRef = {
  id?: InputMaybe<Scalars['ID']>;
  ownerConceptComposition?: InputMaybe<ConceptCompositionRef>;
  sourceArgumentType?: InputMaybe<ConceptArgumentTypeRef>;
  sourceCustomID?: InputMaybe<Scalars['String']>;
  targetConceptArgumentType?: InputMaybe<ConceptArgumentTypeRef>;
  targetConceptCustomID?: InputMaybe<Scalars['String']>;
  targetConceptType?: InputMaybe<TargetConceptType>;
};

export type SubConceptFilter = {
  and?: InputMaybe<Array<InputMaybe<SubConceptFilter>>>;
  has?: InputMaybe<Array<InputMaybe<SubConceptHasFilter>>>;
  id?: InputMaybe<Array<Scalars['ID']>>;
  not?: InputMaybe<SubConceptFilter>;
  or?: InputMaybe<Array<InputMaybe<SubConceptFilter>>>;
};

export enum SubConceptHasFilter {
  Concept = 'concept',
  OwnerConceptComposition = 'ownerConceptComposition',
  Wh = 'wh',
  Xy = 'xy'
}

export type SubConceptOrder = {
  asc?: InputMaybe<SubConceptOrderable>;
  desc?: InputMaybe<SubConceptOrderable>;
  then?: InputMaybe<SubConceptOrder>;
};

export enum SubConceptOrderable {
  Wh = 'wh',
  Xy = 'xy'
}

export type SubConceptPatch = {
  concept?: InputMaybe<ConceptRef>;
  ownerConceptComposition?: InputMaybe<ConceptCompositionRef>;
  wh?: InputMaybe<Scalars['String']>;
  xy?: InputMaybe<Scalars['String']>;
};

export type SubConceptRef = {
  concept?: InputMaybe<ConceptRef>;
  id?: InputMaybe<Scalars['ID']>;
  ownerConceptComposition?: InputMaybe<ConceptCompositionRef>;
  wh?: InputMaybe<Scalars['String']>;
  xy?: InputMaybe<Scalars['String']>;
};

export enum TargetConceptType {
  OtherSubConcept = 'OtherSubConcept',
  OtherSubConceptArgument = 'OtherSubConceptArgument',
  OwnerArgument = 'OwnerArgument',
  Self = 'Self'
}

export type UpdateConceptArgumentTypeInput = {
  filter: ConceptArgumentTypeFilter;
  remove?: InputMaybe<ConceptArgumentTypePatch>;
  set?: InputMaybe<ConceptArgumentTypePatch>;
};

export type UpdateConceptArgumentTypePayload = {
  __typename?: 'UpdateConceptArgumentTypePayload';
  conceptArgumentType?: Maybe<Array<Maybe<ConceptArgumentType>>>;
  numUids?: Maybe<Scalars['Int']>;
};


export type UpdateConceptArgumentTypePayloadConceptArgumentTypeArgs = {
  filter?: InputMaybe<ConceptArgumentTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptArgumentTypeOrder>;
};

export type UpdateConceptCompositionInput = {
  filter: ConceptCompositionFilter;
  remove?: InputMaybe<ConceptCompositionPatch>;
  set?: InputMaybe<ConceptCompositionPatch>;
};

export type UpdateConceptCompositionPayload = {
  __typename?: 'UpdateConceptCompositionPayload';
  conceptComposition?: Maybe<Array<Maybe<ConceptComposition>>>;
  numUids?: Maybe<Scalars['Int']>;
};


export type UpdateConceptCompositionPayloadConceptCompositionArgs = {
  filter?: InputMaybe<ConceptCompositionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type UpdateConceptInput = {
  filter: ConceptFilter;
  remove?: InputMaybe<ConceptPatch>;
  set?: InputMaybe<ConceptPatch>;
};

export type UpdateConceptPayload = {
  __typename?: 'UpdateConceptPayload';
  concept?: Maybe<Array<Maybe<Concept>>>;
  numUids?: Maybe<Scalars['Int']>;
};


export type UpdateConceptPayloadConceptArgs = {
  filter?: InputMaybe<ConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<ConceptOrder>;
};

export type UpdateSubConceptConnectionInput = {
  filter: SubConceptConnectionFilter;
  remove?: InputMaybe<SubConceptConnectionPatch>;
  set?: InputMaybe<SubConceptConnectionPatch>;
};

export type UpdateSubConceptConnectionPayload = {
  __typename?: 'UpdateSubConceptConnectionPayload';
  numUids?: Maybe<Scalars['Int']>;
  subConceptConnection?: Maybe<Array<Maybe<SubConceptConnection>>>;
};


export type UpdateSubConceptConnectionPayloadSubConceptConnectionArgs = {
  filter?: InputMaybe<SubConceptConnectionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptConnectionOrder>;
};

export type UpdateSubConceptInput = {
  filter: SubConceptFilter;
  remove?: InputMaybe<SubConceptPatch>;
  set?: InputMaybe<SubConceptPatch>;
};

export type UpdateSubConceptPayload = {
  __typename?: 'UpdateSubConceptPayload';
  numUids?: Maybe<Scalars['Int']>;
  subConcept?: Maybe<Array<Maybe<SubConcept>>>;
};


export type UpdateSubConceptPayloadSubConceptArgs = {
  filter?: InputMaybe<SubConceptFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<SubConceptOrder>;
};

export type WithinFilter = {
  polygon: PolygonRef;
};

export type ConceptQueryVariables = Exact<{
  conceptName: Scalars['String'];
}>;


export type ConceptQuery = { __typename?: 'Query', getConcept?: { __typename?: 'Concept', arguments: Array<{ __typename?: 'ConceptArgumentType', name: string, capacity: string }>, composition?: { __typename?: 'ConceptComposition', subConcepts: Array<{ __typename?: 'SubConcept', xy?: string | null, wh?: string | null, concept: { __typename?: 'Concept', name: string, composition?: { __typename?: 'ConceptComposition', subConcepts: Array<{ __typename?: 'SubConcept', concept: { __typename?: 'Concept', name: string } }> } | null } }>, connections: Array<{ __typename?: 'SubConceptConnection', sourceCustomID: string, targetConceptType: TargetConceptType, targetConceptCustomID?: string | null, sourceArgumentType: { __typename?: 'ConceptArgumentType', name: string }, targetConceptArgumentType?: { __typename?: 'ConceptArgumentType', name: string } | null }> } | null } | null };


export const ConceptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"concept"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conceptName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getConcept"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conceptName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arguments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subConcepts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"concept"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"composition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subConcepts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"concept"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"xy"}},{"kind":"Field","name":{"kind":"Name","value":"wh"}}]}},{"kind":"Field","name":{"kind":"Name","value":"connections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceCustomID"}},{"kind":"Field","name":{"kind":"Name","value":"sourceArgumentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"targetConceptType"}},{"kind":"Field","name":{"kind":"Name","value":"targetConceptCustomID"}},{"kind":"Field","name":{"kind":"Name","value":"targetConceptArgumentType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConceptQuery, ConceptQueryVariables>;