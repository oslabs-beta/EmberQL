// /* eslint-disable no-console */
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import path from 'path';
// import express, { Request, Response } from 'express';
// // eslint-disable-next-line import/no-extraneous-dependencies
// import fetch from 'node-fetch';

// import schema from './server/schema/schema';
// import cors from 'cors';
// const app = express();
// const PORT = 3001;
// import EmberQL from '../src/EmberQL';
// app.use(cors());

// const redis = require('redis');
// const redisCache = redis.createClient({
//   host: '127.0.0.1',
//   port: 6379,
// });
// redisCache.connect();
// redisCache.on('connect', () => {
//   console.log('Connected to Redis cache');
// });
// const Ember = new EmberQL(schema, redisCache);

// const query1 = `
// query {
//   book(id:5){
//     id
//     genre{
//       id
//     }
//   }
//   author(id:2){
//     id
//     books{
//       id
//     }
//   }
// }
// `;

// function t() {
//   fetch('/graphql', {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json;charset=UTF-8',
//     },
//     body: JSON.stringify({
//       query: query1,
//     }),
//   })
//     .then((res: { json: () => any; }) => res.json())
//     .then((res: any) => console.log(res));
// }
// t();

// app.use('/graphql', Ember.handleQuery, (req, res) => {
  
//   res.status(202).json(JSON.stringify(query1));
// });

// //app.listen(PORT);