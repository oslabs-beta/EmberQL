import {
  DocumentNode,
  FieldNode,
  OperationDefinitionNode,
  visit,
} from 'graphql';

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

        const typename: FieldNode = {
          kind: 'Field',
          name: {
            kind: 'Name',
            value: '__typename',
          },
        };
        return { ...node, selections: [...node.selections, typename] };
      },
    },
  });
};

//input: JSON.parse(graphQLResponse)
const normalizeResponse = (parsedResponse) => {
  const normalizedObj = {};

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
};

const generateKey = (id: string, typename: string): string => {
  return typename + '#' + id;
};

const cacheNormalizedQueryResponse = async (normalizedResponseObj) => {
  for (const redisKey in normalizedResponseObj) {
    if (!(await this.redisCache.exists)) {
      this.redisCache.hset(redisKey, normalizeResponse[redisKey]);
    }
  }
};

//below not sufficient for delete mutations
const cacheNormalizedMuationResponse = async (normalizedResponseObj) => {
  for (const redisKey in normalizedResponseObj) {
    this.redisCache.hset(redisKey, normalizeResponse[redisKey]);
  }
};
