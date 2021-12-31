/* eslint-disable no-console */

import schema from './schema/schema';
import { DocumentNode, getNamedType, graphql, GraphQLField, GraphQLSchema, parse } from 'graphql';
import { GraphQLObjectType } from 'graphql';
import { moveMessagePortToContext } from 'worker_threads';
//import gql from 'graphql-tag';

const book = schema.getTypeMap().Book;


const typeMap = schema.getTypeMap();



const queryString = ` 
  query {
    authors {
      name
    }
  }`;

const query2 = parse(queryString);

// authors.name
// books.id5

const queryById = `
  query {
    author(id: 2) {
      name
      }
      author(id: 4) {
        name
        }
        author(id: 1) {
          name
          }
  }`;

// books.title 
// books.authors[name,country]
// genre.name


const complexQuery = `
  query {
    books {
    title
    authors{
      name
      country
    }
    genre{
      name
    }
    }
}`;



const map = schema.getTypeMap();
Object.keys(typeMap).forEach(name => {
  const gqlType = typeMap[name];
  if (gqlType instanceof GraphQLObjectType) {
    console.log(gqlType.name);
  }
});
//console.log(map);



function getFields(type: GraphQLObjectType) {
  return Object.keys(type.getFields());
}
  

const typeNames :string[] = [];
const fieldNames :string[] = [];
const typeFields :string[] = [];


const queryTypeNames = {} as { [key: string]: any };
const queryFieldNames = {} as { [key: string]: any };


function keyToCache(query: string): string  { 
  
  let result = '';
  console.log(query);
  query = query.replace(/\s/g, '').replace('query', '').replace('{', '').replace('}', '');    //.replace('}', '');
   
  console.log(query);
  //console.log(typeFields);
  getInfo();
  for (let i = 0; i < fieldNames.length; i++) {
    if (query.includes(fieldNames[i])) {
      // console.log(fieldNames[i]);
      result += fieldNames[i];
    }
     
  }
  console.log(result);
  return result;
}
  
//keyToCache(queryString);
//getInfo();
  
function getInfo(): void  {
   
  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];
  
    if (!getNamedType(type).name.startsWith('__') && type instanceof GraphQLObjectType) {
      const fields = type.getFields();
      Object.keys(fields).forEach(fieldName => {
        //const field = fields[fieldName];
  
        typeNames.push(typeName);
        if ( !fieldNames.includes(fieldName)){
          fieldNames.push(fieldName);
        }
        const args = fields[fieldName].args;
        console.log(`${typeName}.${fieldName}`);
        //console.log(args);
        //typeNames.push(typeName);
        //fieldNames.push(fieldName);
        //typeFields.push(`${typeName}.${fieldName}`);
      });
    }
  });
}



//check if query is a query or mutation
function isQuery(query: string): boolean {
  if (query.includes('mutation')) {
    return false;
  }
  return true;
}




function checkId(query: string): string {
 
  const [start, end] = [ query.indexOf(':') + 2, query.indexOf(')')]; //can return -1 if not found
  return query.slice(start, end) || 'err';
 
}

//console.log(checkId(queryById));

//console.log(getIdIndex(queryById));

//const queryAST = typeof complexQuery === 'string' ? parse(complexQuery) : complexQuery;




     
const parsedQuery = parse(queryById);
console.log(parsedQuery);
//queryAST.definitions[0].selectionSet.selections[0].selectionSet.selections;
  
//const firstOperationDefinition = (ast) => ast.definitions[0];
//const firstFieldValueNameFromOperation = (operationDefinition) =>  operationDefinition.selectionSet.selections[0].name.value;

//create ast type for query
//const ast = parse(queryString);
//console.log(ast);
//console.log(mapKey(ast, 'authors'));



// const args = field.args;
//let result = '';
 
//   args.forEach((arg: { name: string; }) => {
//     result += arg.name;
//   });

function mapKey(ast: any): string {
  
 
  const field =  ast.definitions[0].selectionSet.selections[0];
  const fieldName = field.name.value;
  const typeName = field.selectionSet.selections[0].name.value;
 
  
  
  graphql(schema, queryById).then(result => {
    console.log(JSON.stringify(result.data)); 
  });

  return `${typeName}.${fieldName}`;
}

//console.log(mapKey(parsedQuery));




//const id = checkId(queryById);

//  function makeKey(ast: any): Promise<string> {

//   const field =  ast.definitions[0]?.selectionSet.selections[0];

//   const fieldName = field.name.value;
//   const key = `${fieldName}#${id}`;
//   const redisObject = {} as { [key: string]: any };

    
//   const result = await graphql(schema, queryById);
//   redisObject[key] = result.data;
//   console.log(JSON.stringify(redisObject));
//   return JSON.stringify(redisObject);
// }
// makeKey(parsedQuery);

const id = checkId(queryById);


//first need to parse(query)
//then pass parsed query to makeKey()
//takes in query ast
function makeKey(ast: any): string {
  const field = ast.definitions[0]?.selectionSet.selections[0];
  const fieldName = field.name.value;
  const key = `${fieldName}#${id}`;

  return key;
}
console.log(makeKey(parsedQuery));










//need to iterate through the query and find all id's and fieldNames



// graphql(schema, queryString).then(result => {
//   console.log(result);
// });

// graphql(schema, queryById);

//   firstOperationDefinition(parsedQuery).selectionSet.selections.forEach(selection => {
//     console.log(selection.name.value);
//     });




// function mapNestedValue(ast ) {
 
//   Object.keys(complexQuery).forEach(key => {
 
//    console.log(key);
//   });
//   return complexQuery;
// }

// const ast = parse(complexQuery);

// mapNestedValue(ast);




//getargs(queryString);

// function getargs(queryString){
//     const query = parse(queryString);
//     const field = query.definitions[0].selectionSet.selections[0];
//     const args = field.arguments;
//     console.log(args);

// }







// Object.keys(typeMap).map((typeName: string) => {
//   const type = typeMap[typeName];
//   if (type instanceof GraphQLObjectType) {
//     //console.log(typeName);
//   }
// });


//get index of hashtag/or loop into hashtag 
//typename, id

//typename,args for key in redis
//selection.name.kind

