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

const ASTtoQueryString = (ast: DocumentNode): string => print(ast);
const generateKey = (typename: string, id: string): string => {
  return typename + '#' + id;
};
//input: JSON.parse(graphQLResponse)
const normalizeResponse = (parsedResponse: { [x: string]: any }) => {
  const refObj: { [x: string]: any } = {};

  const helper = (parsedResponse: { [x: string]: any }) => {
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
            refObj[normalizeKey] = helper(value);
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
              refObj[normalizeKey] = helper(obj);
              //add references
              if (normalizedObj[key])
                normalizedObj[key].__ref.push(normalizeKey);
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

  const normal = helper(parsedResponse.data ?? parsedResponse);
  console.log(normal);
  return refObj;
};

const response = {
  data: {
    movies: [
      {
        __typename: 'Movie',
        id: '1',
        title: 'Indiana Jones and the Last Crusade',
        genre: 'ACTION',
        actors: [
          {
            __typename: 'Actor',
            id: '1',
            firstName: 'Harrison',
          },
          {
            __typename: 'Actor',
            id: '2',
            firstName: 'Sean',
          },
        ],
      },
      {
        __typename: 'Movie',
        id: '4',
        title: 'Air Force One',
        genre: 'ACTION',
        actors: [
          {
            __typename: 'Actor',
            id: '1',
            firstName: 'Harrison',
          },
          {
            __typename: 'Actor',
            id: '5',
            firstName: 'Gary',
          },
        ],
      },
    ],
    actors: [
      {
        __typename: 'Actor',
        id: '1',
        firstName: 'Harrison',
      },
      { __typename: 'Actor', id: '2', firstName: 'Sean' },
      { __typename: 'Actor', id: '3', firstName: 'Mark' },
      { __typename: 'Actor', id: '4', firstName: 'Patti' },
    ],
  },
};

console.log(JSON.stringify(normalizeResponse(response)));
// function checkId(query: string): string {
//   const [start, end] = [query.indexOf(':') + 2, query.indexOf(')')]; //can return -1 if not found
//   return query.slice(start, end) || 'err';
// }

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
