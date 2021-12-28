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
      if (!Array.isArray(value)) {
        if (parsedResponse[key].id && parsedResponse[key].__typename) {
          const normalizeKey = generateKey(
            parsedResponse[key].id,
            parsedResponse[key].__typename
          );
          normalizedObj[normalizeKey] = normalizeResponse(parsedResponse[key]);
        } else normalizedObj[key] = value;
      }
    } else {
      normalizedObj[key] = parsedResponse[key];
    }
  }
};

const generateKey = (id: string, typename: string): string => {
  return typename + '#' + id;
};
