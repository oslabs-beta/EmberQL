"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const redis = require('redis');
const fetch = require('node-fetch');
class EmberQL {
    constructor(schema, redisCache) {
        this.handleQuery = this.handleQuery.bind(this);
        this.clearCache = this.clearCache.bind(this);
        this.heartbeat = this.heartbeat.bind(this);
        this.increaseTTL = this.increaseTTL.bind(this);
        this.graphQLQuery = '';
        this.schema = schema;
        this.redisCache = redisCache;
    }
    handleQuery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.graphQLQuery = req.body.query;
            if (yield this.redisCache.exists(this.graphQLQuery)) {
                const response = yield this.redisCache.get(this.graphQLQuery);
                res.locals.data = JSON.parse(response);
                return next();
            }
            else {
                const results = yield (0, graphql_1.graphql)({
                    schema: this.schema,
                    source: this.graphQLQuery,
                });
                this.redisCache.set(this.graphQLQuery, JSON.stringify(results));
                res.locals.data = results;
                return next();
            }
        });
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
            .then((data) => data.json())
            .then((data) => {
            const date = new Date();
            // console.log('data:', data);
            if (data.errors) {
                for (const error of data.errors) {
                    // console.log(error.message.slice(0, 20));
                    if (error.message.slice(0, 20) === 'connect ECONNREFUSED') {
                        console.log(`Heartbeat FAILED, Cache invalidation halted. ${date}`);
                        this.increaseTTL();
                    }
                }
            }
            else {
                console.log(`Heartbeat OK, ${date}`);
            }
        })
            .catch((err) => {
            console.log('entered catch');
            if (err.code === 'ECONNREFUSED')
                this.increaseTTL();
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
    increaseTTL() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('TTL increased on all KEYS');
            const keysArr = yield this.redisCache.keys('*');
            for (const key of keysArr) {
                const currentTTL = yield this.redisCache.ttl(key);
                // console.log('before', currentTTL);
                // ttl time is in seconds
                yield this.redisCache.EXPIRE(key, currentTTL + 60);
                console.log(yield this.redisCache.ttl(key));
            }
        });
    }
    clearCache(req, res, next) {
        this.redisCache.flushAll();
        next();
    }
}
exports.default = EmberQL;
