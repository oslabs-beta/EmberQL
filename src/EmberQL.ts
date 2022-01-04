import { graphql, GraphQLSchema } from '../demo/node_modules/graphql';
import * as express from 'express';
const redis = require('redis');
const fetch = require('node-fetch');

import { generateFieldsMap, generateQueryMap } from './maps';
import { traverse } from './astTraversal';
import { OperationDefinitionNode, parse, print } from 'graphql';
import { normalizeResponse } from './normalize';
import schema from '../demo/server/schema/schema';
import { query } from '../demo/server/models/db';
//import { query } from '../demo/server/models/db';

class EmberQL {
  redisClient: any;
  graphQLQuery: string;
  schema: GraphQLSchema;
  redisCache: any;
  normalize: Boolean;
  ttl: number;
  identifiers: string[];
  queryMap: { [queryName: string]: any };
  fieldsMap: { [typename: string]: any };

  constructor(
    schema: GraphQLSchema,
    redisCache: any,
    normalize = true,
    ttl = 36000,
    identifiers = ['id', '_id', 'ID', 'Id']
  ) {
    this.handleQuery = this.handleQuery.bind(this);
    this.clearCache = this.clearCache.bind(this);
    this.heartbeat = this.heartbeat.bind(this);
    this.increaseTTL = this.increaseTTL.bind(this);
    this.getFromCache = this.getFromCache.bind(this);

    this.graphQLQuery = ``;
    this.schema = schema;
    this.queryMap = generateQueryMap(schema);
    this.fieldsMap = generateFieldsMap(schema);

    this.redisCache = redisCache;
    this.ttl = ttl;
    this.normalize = normalize;
    this.identifiers = identifiers;
  }

 
  async handleQuery(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    this.graphQLQuery = req.body.query; //<-- this is the original code

    //send to next middleware if there is no query
    if (this.graphQLQuery === undefined) return next(); //<-- this is the original code

   // const ast = parse(this.graphQLQuery); <-- this is the original code
 
    const ast = parse(this.graphQLQuery);
    //TODO add operationType fetching to traverse method
    const operationType = (ast.definitions[0] as OperationDefinitionNode)
      .operation;

    if (this.normalize) {
      const { redisKeys, queryFields, modifiedAST } = traverse(
        ast,
        this.fieldsMap,
        this.queryMap,
        this.identifiers
      );

      if (operationType === 'query') {
        const cached: { [queryName: string]: any } = {};
        let missing = false;
        for (const key of redisKeys) {
          const value = this.getFromCache(key);
          if (value === null) {
            missing = true;
            break;
          }
          //make full query if any keys missing
          else {
            // NEED TO REFACTOR KEY SO THAT THEY HAVE QUERY NAME APPENDED
            cached[key] = value;
          }
        }
          if (missing) {
            const response:any  = await graphql(this.schema, print(modifiedAST));
            // NEED TO FILTER OUT UNWANTEDFIELDS
            const filter = (obj: {[key: string]: any}, set: Set<string>) => {
              for(const key in obj){
                if(!set.has(key)) delete obj[key]
                if(queryFields[key]){
                  if(Array.isArray(obj[key])){
                    obj[key] = obj[key].map((object:{[key: string]: any}) => filter(object, queryFields[key]))
                  }
                  else if(typeof obj[key] === 'object') filter(obj[key], queryFields[key])
                  else {
                    // ?????
                    continue
                  }
                }
              }
            
            }
            //Might need to may copy of response here so we can cache the full response
            //make deep copy of response
            const filteredResponse = JSON.parse(JSON.stringify(response))
         
            filter(filteredResponse, new Set(Object.keys(queryFields.data ?? queryFields)));
            
            // const filtered: {[x: string]:any} = {};
            // for(const field in response){
            //     console.log("testing" + field);

            //     const newArr: Array<any> = [];
            //     for(const item of response[field]){
            //         newArr.push(item);
            //     }
            //     filtered[field] = newArr;
            // }

                // if(Array.isArray(response[field])){
                //     filtered[field] = response[field].map((item:any)=>{
                //         const filteredItem:{[x: string]:any} = {};
                //         for(const field in item){
                //             if(this.fieldsMap[field]){
                //                 filteredItem[field] = item[field]
                         
                //             }
                //         }
                //         return filteredItem;
                //     })

          

            const normalized = normalizeResponse(response);
            for(const key in normalized){
              //hset
            }
            //WRITE NORMALIZED TO CACHE;
            //res.locals appending
            res.locals.query = filteredResponse
            return next()
          } else{
            res.locals.query = cached
            return next()
          }
        
      } else if (operationType === 'mutation') {
      } else {
      }
    } else {
      if (
        (await this.redisCache.exists(this.graphQLQuery)) &&
        operationType === 'query'
      ) {
        const response = await this.redisCache.get(this.graphQLQuery);
        res.locals.data = JSON.parse(response);
        return next();
      } else {
        const results = await graphql({
          schema: this.schema,
          source: this.graphQLQuery,
        });

        if (operationType === 'mutation') {
          this.redisCache.flushAll();
          return next();
        }

        this.redisCache.set(this.graphQLQuery, JSON.stringify(results));
        console.log(results);
        res.locals.data = results;
        return next();
      }
    }
  }

  heartbeat() {
    console.log('enter heartbeat');
    fetch('http://localhost:3000/heartbeat', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        query: '{book(id:1){id}}',
      }),
    })
      .then((data: any) => data.json())
      .then((data: any) => {
        const date = new Date();
        // console.log('data:', data);
        if (data.errors) {
          for (const error of data.errors) {
            // console.log(error.message.slice(0, 20));
            if (error.message.slice(0, 20) === 'connect ECONNREFUSED') {
              console.log(
                `Heartbeat FAILED, Cache invalidation halted. ${date}`
              );
              this.increaseTTL();
            }
          }
        } else {
          console.log(`Heartbeat OK, ${date}`);
        }
      })
      .catch((err: any) => {
        console.log('entered catch');
        if (err.code === 'ECONNREFUSED') this.increaseTTL();
      });
  }

  // heartbeat() {
  //   console.log('enter heartbeat');
  //   graphql(this.schema, '{books{title}}')
  //     // .then((data: any) => data.json())
  //     .then((data: any) => console.log(data))
  //     .catch((err: any) => {
  //       console.log('entered catch');
  //       console.log(err);
  //       if (err.code === 'ECONNREFUSED') this.increaseTTL();
  //     });
  // }

  getFromCache = async (key: string): Promise<any> => {
    const redisResponse = await this.redisCache.hget(key);
    if (redisResponse === null) return null;
    return await Object.keys(redisResponse).reduce(async (curr, el) => {
      if (redisResponse[el]?.__ref)
        return Object.assign(curr, {
          el: redisResponse[el].__ref.map(
            async (ref: string) => await this.getFromCache(ref)
          ),
        });
      else return Object.assign(curr, { el: redisResponse[el] });
    }, {});
  };

  async increaseTTL() {
    console.log('TTL increased on all KEYS');
    const keysArr = await this.redisCache.keys('*');
    for (const key of keysArr) {
      const currentTTL = await this.redisCache.ttl(key);
      // console.log('before', currentTTL);
      // ttl time is in seconds
      await this.redisCache.EXPIRE(key, currentTTL + 60);

      console.log(await this.redisCache.ttl(key));
    }
  }

  clearCache(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    this.redisCache.flushAll();
    next();
  }
}






export default EmberQL;
