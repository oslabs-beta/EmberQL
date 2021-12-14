import { graphql, GraphQLSchema } from '../demo/node_modules/graphql';
import * as express from 'express';
const redis = require('redis');

class EmberQL {
  redisClient: any;
  flushall: any;
  graphQLQuery: string;
  schema: GraphQLSchema;
  redisCache: any;

  // Q: What is the type of a

  constructor(schema: GraphQLSchema, redisCache: any) {
    this.handleQuery = this.handleQuery.bind(this);
    this.flushCache = this.flushCache.bind(this);

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
      res.locals.data = results;
      return next();
    }
  }

  flushCache(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    this.redisCache.flushall();
    return next();
  }
}

export default EmberQL;
