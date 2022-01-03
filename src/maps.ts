import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLType,
} from 'graphql';

//function to generate map from GQLObjectTypes in Schema to a set containing all fields of the object (eg book : Set[title, id, authors, genre, publisher, __typename])

const defaultTypes = new Set([
  'String',
  'Int',
  'Float',
  'Boolean',
  'ID',
  'Query',
  '__Type',
  '__Field',
  '__EnumValue',
  '__DirectiveLocation',
  '__Schema',
  '__TypeKind',
  '__InputValue',
  '__Directive',
]);

export const generateFieldsMap = (
  schema: GraphQLSchema
): { [typename: string]: Set<string> } => {
  const typeMap = schema.getTypeMap();
  const filteredMap = Object.keys(typeMap).filter(
    (type) => !defaultTypes.has(type)
  );
  const fieldsMap: { [typename: string]: Set<string> } = {};
  for (const type of filteredMap) {
    const typeObj = typeMap[type];
    const fields = (typeObj as GraphQLObjectType).getFields();

    fieldsMap[type] = new Set(Object.keys(fields));

    //new implementation to account for GraphQLListTypes
    // fieldsMap[type] = new Set();
    // for (const field in fields) {
    //   //TODO fix typing of typeName
    //   // check if type is a list type or graphqlobjecttype

    //   const typeName: any = fields[field].type;
    //   if (typeName.ofType) {
    //     fieldsMap[type].add(typeName.ofType.name);
    //   } else {
    //     if (defaultTypes.has(typeName.name)) fieldsMap[type].add(field);
    //     else fieldsMap[type].add(typeName.name);
    //   }
    //}
  }
  return fieldsMap;
};

const getQueriesFromSchema = (schema: GraphQLSchema) => {
  const queries = schema.getQueryType()?.getFields();
  return queries;
};

//generates map that maps from query names to return value of GraphQLObjectTypes
export const generateQueryMap = (
  schema: GraphQLSchema
): { [queryName: string]: any } => {
  const queryList = schema.getQueryType()?.getFields(); // is a map, not a list/array
  const queryMap: { [queryName: string]: any } = {};
  for (const query in queryList) {
    //check for graphqllisttype
    const typeName: any = queryList[query].type;
    if (typeName.ofType) queryMap[query] = typeName.ofType.name;
    else queryMap[query] = queryList[query].type;
  }
  return queryMap;
};

//TODO mutation map
