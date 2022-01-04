import {
  DocumentNode,
  FieldNode,
  IntValueNode,
  OperationDefinitionNode,
  parse,
  StringValueNode,
  visit,
  print,
  execute,
  graphql,
} from 'graphql';
import schema from '../demo/server/schema/schema';

import { generateFieldsMap, generateQueryMap } from './maps';

//gets all query fields, add missing query fields and __typename to ast. does not yet check or append __typename
export const traverse = (
  ast: DocumentNode,
  fieldMap: { [typename: string]: any },
  queryMap: { [queryName: string]: any },
  identifiers: string[] = ['id', '_id', 'ID', 'Id']
): any =>
  // {
  //   [queryFields: string]: { [queryName: string]: any },
  //   [ast: string]: DocumentNode;
  // }
  {
    const defaultTypes = new Set(['String', 'Int', 'Float', 'Boolean', 'ID']);

    const queryFields: { [queryName: string]: any } = {};
    const rels: { [queryName: string]: any } = {};
    const redisKeys: string[] = [];

    return {
      redisKeys,
      queryFields,
      modifiedAST: visit(ast, {
        Field: {
          enter(node, key, parent) {
            if (node.arguments) {
              const queryName = node.name.value;
              const typeName = queryMap[queryName] ?? queryName;
              const idVariants = new Set(identifiers);
              const argumentWithID = node.arguments.filter((argument) =>
                idVariants.has(argument.name.value)
              );

              if (argumentWithID.length > 0) {
                const valueNode = argumentWithID[0].value as
                  | IntValueNode
                  | StringValueNode;
                const id = valueNode.value;
                const redisKey = generateKey(typeName, id);
                redisKeys.push(redisKey);
              }
            }
          },
        },

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
            const parentName = (parent as FieldNode).name.value;
            queryFields[parentName] = fields;

            const missingFieldNodes = [];
            const parentType =
              //fieldMap[parentName] ??
              rels[parentName] ?? //
              queryMap[parentName] ?? // first iteration is query
              {};
            for (const field in fieldMap[parentType]) {
              const fieldObj = fieldMap[parentType][field];

              if (defaultTypes.has(fieldObj.type.name)) {
                if (!fields.has(fieldObj.name)) {
                  missingFieldNodes.push(makeFieldNode(fieldObj.name));
                }
              } else {
                if (!fields.has(fieldObj.name)) {
                  missingFieldNodes.push(makeFieldNode(fieldObj.name, []));
                }
                rels[fieldObj.name] =
                  fieldObj.type.ofType?.name ?? fieldObj.type;
              }
            }
            //add typename
            if (!fields.has('__typename'))
              missingFieldNodes.push(makeFieldNode('__typename'));
            // const missingFieldNodes = missingFields.map((field) =>
            //   makeFieldNode(field)
            // );
            if (rels[parentName]) delete rels[parentName];
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
            for (const field of fieldMap[parentType]) {
              if (!fields.has(field)) missingFields.push(field);
            }
            const missingFieldNodes = missingFields.map((field) =>
              makeFieldNode(field)
            );
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
export const getKeysFromQueryAST = (
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

const makeFieldNode = (
  fieldName: string,
  selection?: Array<any>
): FieldNode => {
  return {
    kind: 'Field',
    name: {
      kind: 'Name',
      value: fieldName,
    },
    selectionSet:
      selection === undefined
        ? undefined
        : {
            kind: 'SelectionSet',
            selections: selection,
          },
  };
};

const query = `{
  book(id:5){
    id
    genre{
      id
    }
  }
}`;
const response = {
  book : [{
    id: 5,
    __typename: 'Book',
    title: 'asdf',
    authors: [
      { id: 2,
        name: 'asdfas',
        country: 'asdfasdf'
      }
    ],
    genre:{
      id: 'asdfasd',
      name: 'asdfas'
    }
  }]
}
//const queryFields = { book: Set { 'id', 'genre' }, genre: Set { 'id' }, authors: Set {} }
const ast = parse(query);
const queryMap = generateQueryMap(schema);
const fieldsMap = generateFieldsMap(schema);
//console.log(fieldsMap); //{ book: Set { 'id', 'genre' }, genre: Set { 'id' }, authors: Set {} }
//console.log(print(traverse(ast, fieldsMap, queryMap).ast));
//console.log(traverse(ast, fieldsMap, queryMap).queryFields); <-- this is the one you want
//console.log(execute(schema, parse(`{__typename}`)));


// const filter = (obj: {[key: string]: any}, set: Set<string>) => {
//   for(const key in obj){
//     if(!set.has(key)) delete obj[key]
//     if(queryFields[key]){
//       if(Array.isArray(obj[key])){
//         obj[key] = obj[key].map((object) => filter(object, queryFields[key]))
//       }
//       else if(typeof obj[key] === 'object') obj[key] = filter(obj)
//       else {
//         // ?????

//       }
//     }
//   }

// }