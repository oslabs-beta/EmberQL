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

//gets all query fields and add missing query fields to ast. does not yet check or append __typename
const getAllQueryFields = (
  ast: DocumentNode,
  fieldMap: { [typename: string]: Set<string> }
) => {
  const queryFields = {};

  visit(ast, {
    SelectionSet: {
      enter(node, key, parent) {
        const fields = new Set();
        if ((parent as OperationDefinitionNode)?.kind === 'OperationDefinition')
          return;
        if (!node.selections) return;

        for (const selection of node.selections) {
          if (selection.kind === 'Field') fields.add(selection.name.value);
        }
        queryFields[(parent as FieldNode).name.value] = fields;

        const missingFields = [];
        for (const field of fieldMap[(parent as FieldNode).name.value]) {
          if (!fields.has(field)) missingFields.push(field);
        }

        missingFields.map((field) => makeFieldNode(field));
        return { ...node, selections: [...node.selections, ...missingFields] };
      },
    },
  });
  return queryFields;
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

//TODO fix typing of queryMap (here and in maps file)
const getKeysFromQueryAST = (
  ast: DocumentNode,
  queryMap: { [queryName: string]: any }
): string[] => {
  const keys: string[] = [];
  visit(ast, {
    SelectionSet: {
      enter(node, key, parent) {
        const selections = node.selections;
        for (const selection of selections) {
          if (selection.kind === 'Field' && selection.arguments) {
            const queryName = selection.name.value;
            const typeName = queryMap[queryName];
            const idVariants = new Set(['id', '_id', 'ID', 'Id']);
            const argumentWithID = selection.arguments.filter((argument) =>
              idVariants.has(argument.name.value)
            );
            if (argumentWithID.length > 0) {
              const valueNode = argumentWithID[0].value as
                | IntValueNode
                | StringValueNode;
              const id = valueNode.value;
              const redisKey = generateKey(typeName, id);
              keys.push(redisKey);
            }
          }
        }
      },
    },
  });
  return keys;
};

const generateKey = (typename: string, id: string): string => {
  return typename + '#' + id;
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
