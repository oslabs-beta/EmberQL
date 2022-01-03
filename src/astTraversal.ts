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
import schema from '/Users/Home/codesmith/EmberQL/demo/server/schema/schema';

import { generateFieldsMap, generateQueryMap } from './maps';

//gets all query fields, add missing query fields and __typename to ast. does not yet check or append __typename
const traverse = (
  ast: DocumentNode,
  fieldMap: { [typename: string]: Set<string> },
  queryMap: { [queryName: string]: any }
): any =>
  // {
  //   [queryFields: string]: { [queryName: string]: any },
  //   [ast: string]: DocumentNode;
  // }
  {
    const queryFields: { [queryName: string]: any } = {};

    return {
      queryFields,
      ast: visit(ast, {
        SelectionSet: {
          enter(node, key, parent) {
            const fields = new Set();
            if (
              (parent as OperationDefinitionNode)?.kind ===
              'OperationDefinition'
            )
              return;
            if (!node.selections) return;

            for (const selection of node.selections) {
              if (selection.kind === 'Field') fields.add(selection.name.value);
            }
            queryFields[(parent as FieldNode).name.value] = fields;

            const missingFields = [];
            const parentType = queryMap[(parent as FieldNode).name.value];

            for (const field of fieldMap[parentType]) {
              if (!fields.has(field)) missingFields.push(field);
            }
            //add typename
            if (!fields.has('__typename')) missingFields.push('__typename');
            const missingFieldNodes = missingFields.map((field) =>
              makeFieldNode(field)
            );
            console.log(missingFieldNodes);
            return {
              ...node,
              selections: [...node.selections, ...missingFieldNodes],
            };
          },
        },
      }),
    };
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

//gets all query fields and add missing query fields to ast. does not yet check or append __typename
const getAllQueryFields = (
  ast: DocumentNode,
  fieldMap: { [typename: string]: Set<string> },
  queryMap: { [queryName: string]: any }
): any =>
  // {
  //   [queryFields: string]: { [queryName: string]: any },
  //   [ast: string]: DocumentNode;
  // }
  {
    const queryFields: { [queryName: string]: any } = {};

    return {
      queryFields,
      ast: visit(ast, {
        SelectionSet: {
          enter(node, key, parent) {
            const fields = new Set();
            if (
              (parent as OperationDefinitionNode)?.kind ===
              'OperationDefinition'
            )
              return;
            if (!node.selections) return;

            for (const selection of node.selections) {
              if (selection.kind === 'Field') fields.add(selection.name.value);
            }
            queryFields[(parent as FieldNode).name.value] = fields;

            const missingFields = [];
            //console.log(parent.type)
            const parentType = queryMap[(parent as FieldNode).name.value];
            console.log(parentType);
            console.log(fieldsMap[parentType]);
            for (const field of fieldMap[parentType]) {
              console.log('asdfas');
              if (!fields.has(field)) missingFields.push(field);
            }
            const missingFieldNodes = missingFields.map((field) =>
              makeFieldNode(field)
            );
            console.log(missingFieldNodes);
            return {
              ...node,
              selections: [...node.selections, ...missingFieldNodes],
            };
          },
        },
      }),
    };
  };

//TODO fix typing of queryMap (here and in maps file)
// how to address listtypes ? eg key getting made for '[Author]#3'
// should query be a key when no id eg books?
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
            console.log('adsfaf');
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

const query = `{
  book(id:5){
    id
    authors {
      id
      name
    }
  }
}`;
const ast = parse(query);
const queryMap = generateQueryMap(schema);
const fieldsMap = generateFieldsMap(schema);
console.log(fieldsMap);
console.log(queryMap);
console.log(print(traverse(ast, fieldsMap, queryMap).ast));
