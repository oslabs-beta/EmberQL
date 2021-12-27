/* eslint-disable no-console */

import schema from './schema/schema';
import { getNamedType, graphql, GraphQLField, GraphQLSchema, parse } from 'graphql';
import { GraphQLObjectType } from 'graphql';
//import gql from 'graphql-tag';



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
  getInfo();
  
function getInfo(): void  {
   
  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];
  
    if (!getNamedType(type).name.startsWith('__') && type instanceof GraphQLObjectType) {
      const fields = type.getFields();
      Object.keys(fields).forEach(fieldName => {
        //const field = fields[fieldName];
        //FieldIteratorFn(field, typeName, fieldName);
        typeNames.push(typeName);
        if ( !fieldNames.includes(fieldName)){
          fieldNames.push(fieldName);
        }
        console.log(`${typeName}.${fieldName}`);
        //typeNames.push(typeName);
        //fieldNames.push(fieldName);
        //typeFields.push(`${typeName}.${fieldName}`);
      });
    }
  });
}