import { graphql, GraphQLSchema } from '../demo/node_modules/graphql';
import * as express from 'express';
const redis = require('redis');
const fetch = require('node-fetch');

class EmberQL {
  redisClient: any;
  graphQLQuery: string;
  schema: GraphQLSchema;
  redisCache: any;

  constructor(schema: GraphQLSchema, redisCache: any) {
    this.handleQuery = this.handleQuery.bind(this);
    this.clearCache = this.clearCache.bind(this);
    this.heartbeat = this.heartbeat.bind(this);
    this.increaseTTL = this.increaseTTL.bind(this);

    this.graphQLQuery = '';
    this.schema = schema;
    this.redisCache = redisCache;
  }

  async handleQuery(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    this.graphQLQuery = req.body.query;

    if (await this.redisCache.exists(this.graphQLQuery)) {
      const response = await this.redisCache.get(this.graphQLQuery);
      res.locals.data = JSON.parse(response);
      return next();
    } else {
      const results = await graphql({
        schema: this.schema,
        source: this.graphQLQuery,
      });
      this.redisCache.set(this.graphQLQuery, JSON.stringify(results));
      console.log(results);
      res.locals.data = results;
      return next();
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
