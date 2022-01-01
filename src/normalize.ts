import {
  DocumentNode,
  FieldNode,
  getNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  IntValueNode,
  OperationDefinitionNode,
  parse,
  StringValueNode,
  visit,
  print,
} from 'graphql';

// Finds and returns an array of GraphQLObjectTypes in schema with defaults excluded
export const getTypes = (schema: GraphQLSchema) => {
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
  const typeMap = schema.getTypeMap();
  const filteredMap = Object.keys(typeMap)
    .filter((type) => !defaultTypes.has(type))
    .reduce((curr, key) => Object.assign(curr, { key: typeMap[key] }), {});
  //Object {typename: typeObject, typename: typeObject}
  return filteredMap;
};

//TODO function to generate map from GQLObjectTypes in Schema to a set containing all fields of the object (eg book : Set[title, id, authors, genre, publisher, __typename])

const makeFieldsMap = (schema: GraphQLSchema) => {
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
  const typeMap = schema.getTypeMap();
  const filteredMap = Object.keys(typeMap).filter(
    (type) => !defaultTypes.has(type)
  );
  const results: { [x: string]: any } = {};
  for (const type of filteredMap) {
    const typeObj = typeMap[type];
    const fields = (typeObj as GraphQLObjectType).getFields();
    results[type] = new Set(Object.keys(fields));
  }

  return results;
};

const getQueriesFromSchema = (schema: GraphQLSchema) => {
  const queries = schema.getQueryType()?.getFields();
  return queries;
};

const getFields = (typeObject: GraphQLObjectType) => typeObject.getFields();

// //generates map that maps from query names to return value of GraphQLObjectTypes
const generateQueryMap = (schema: GraphQLSchema) => {
  const queryList = getQueriesFromSchema(schema);
  const typeMap: { [queryName: string]: any } = {};
  for (const query in queryList) {
    typeMap[query] = queryList[query].type;
  }
  return typeMap;
};

const addTypenameToQuery = (ast: DocumentNode): DocumentNode => {
  return visit(ast, {
    SelectionSet: {
      enter(node, key, parent) {
        //ignore OperationDefinitions
        if ((parent as OperationDefinitionNode)?.kind === 'OperationDefinition')
          return;
        //ignore if no selections
        if (!node.selections) return;
        //ignore if selections have a typename
        if (
          node.selections.some(
            (selection) =>
              selection.kind === 'Field' &&
              selection.name.value === '__typename'
          )
        )
          return;

        const typename = makeFieldNode('__typename');
        return { ...node, selections: [...node.selections, typename] };
      },
    },
  });
};

const makeFieldNode = (fieldName: string): FieldNode => {
  return {
    kind: 'Field',
    name: {
      kind: 'Name',
      value: fieldName,
    },
  };
};

const ASTtoQueryString = (ast: DocumentNode): string => print(ast);

//input: JSON.parse(graphQLResponse)
const normalizeResponse = (parsedResponse: { [x: string]: any }) => {
  const normalizedObj: { [x: string]: any } = {};

  for (const key in parsedResponse) {
    const value = parsedResponse[key];

    if (typeof value === 'object') {
      //value is an object
      if (!Array.isArray(value)) {
        //check if value is normalizable
        if (value.id && value.__typename) {
          const normalizeKey = generateKey(value.id, value.__typename);
          //normalize
          normalizedObj[normalizeKey] = normalizeResponse(value);
          //add references
          if (normalizedObj[key]) normalizedObj[key].__ref.push(normalizeKey);
          else normalizedObj[key] = { __ref: [normalizeKey] };
        } else normalizedObj[key] = value;
      }
      //value is an array
      else {
        //check if first item is normalizable. if normalizable, all elements should be normalizable b/c array is a graphqllist
        if (value[0].id && value[0].__typename) {
          for (const obj of parsedResponse[key]) {
            const normalizeKey = generateKey(obj.id, obj.__typename);
            //normalize
            normalizedObj[normalizeKey] = normalizeResponse(obj);
            //add references
            if (normalizedObj[key]) normalizedObj[key].__ref.push(normalizeKey);
            else normalizedObj[key] = { __ref: [normalizeKey] };
          }
        } else normalizedObj[key] = value;
      }
    }
    //value is not an object
    else {
      normalizedObj[key] = parsedResponse[key];
    }
  }
  return normalizedObj;
};

function checkId(query: string): string {
  const [start, end] = [query.indexOf(':') + 2, query.indexOf(')')]; //can return -1 if not found
  return query.slice(start, end) || 'err';
}

const generateKey = (typename: string, id: string): string => {
  return typename + '#' + id;
};

// const cacheNormalizedQueryResponse = async (normalizedResponseObj) => {
//   for (const redisKey in normalizedResponseObj) {
//     if (!(await this.redisCache.exists)) {
//       this.redisCache.hset(redisKey, normalizeResponse[redisKey]);
//     }
//   }
// };

// //below not sufficient for delete mutations
// const cacheNormalizedMuationResponse = async (normalizedResponseObj) => {
//   for (const redisKey in normalizedResponseObj) {
//     this.redisCache.hset(redisKey, normalizeResponse[redisKey]);
//   }
// };

// const getKeysFromQueryAST = (ast: DocumentNode): string[] => {
//   const keys: string[] = [];
//   visit(ast, {
//     SelectionSet: {
//       enter(node, key, parent) {
//         const selections = node.selections;
//         for (const selection of selections) {
//           if (selection.kind === 'Field' && selection.arguments) {
//             const queryName = selection.name.value;
//             const typeName = this.queryMap[queryName];
//             const idVariants = new Set(['id', '_id', 'ID', 'Id']);
//             const argumentWithID = selection.arguments.filter((argument) =>
//               idVariants.has(argument.name.value)
//             );
//             if (argumentWithID.length > 0) {
//               const valueNode = argumentWithID[0].value as
//                 | IntValueNode
//                 | StringValueNode;
//               const id = valueNode.value;
//               const redisKey = generateKey(typeName, id);
//               keys.push(redisKey);
//             }
//           }
//         }
//       },
//     },
//   });
//   return keys;
// };

const getTypenameFromKey = (key: string): string => {
  const charIndex = key.indexOf('#');
  return key.slice(0, charIndex + 1);
};

//need to use getTypenameFromKey to make outer object in getFromCache

//might need to filter out fields that weren't requested in queryString
// const getFromCache = async (key: string): Promise<any> => {
//   const redisResponse = await this.redisCache.hget(key);
//    if (redisResponse === null) return null
//   return await Object.keys(redisResponse).reduce(async (curr, el) => {
//     if (redisResponse[el]?.__ref)
//       return Object.assign(curr, {
//         el: redisResponse[el].__ref.map(
//           async (ref: string) => await getFromCache(ref)
//         ),
//       });
//     else return Object.assign(curr, { el: redisResponse[el] });
//   }, {});
// };

// module.exports = {
//   getTypes,
// };

/*

//gets all query fields and add missing query fields to ast. does not yet check or append __typename
const getAllQueryFields = (ast: DocumentNode) => {
  const queryFields = {};

  visit(ast, {
    SelectionSet: {
      enter(node, key, parent) {
        const fields = new Set;
        if(parent as OperationDefinitionNode).?kind === 'OperationDefinition') return
        if(!node.selections) return

        for(const selection of node.selections){
          if (selection.kind === 'Field') fields.set(selection.name.value)
        }
        queryFields[parent.name.value] = fields

        const missingFields = [];
        for(const field of this.fieldMap[parent.name.value]){
          if(!fields.has(field)) missingFields.push(field)
        }

        missingFields.map((field) => makeFieldNode(field))
        return {...node, selections: [...node.selections, ...missingFields]}
      }
    }
  })
  this.queryFields = queryFields
}

*/

/*

const badKeys = []
cachedResponses = []
for(const key of redisKeys){
  const result = getFromCache(key);
  if(result === null) badKeys.push(key)

  //maybe build larger obj here?
  else cachedResponses.push({ getTypenameFromKey(key):result})
}

const fullResponse = await graphql(print(ast), schema)

const normalized = normalizeResponse(JSON.stringify(fullResponse))
//how to minimize attempting to recache???

*/

/* 
  I think this is finished above in makeFieldsMap

  Object.keys(typeMap.forEach(typeName => {
    const type = typeMap[typeName];
    if (!getNamedType(type).name.startsWith('__') && type instanceof GraphQLObjectType) {
      
    }
  ]))


*/
