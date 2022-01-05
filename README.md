# EmberQL

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/oslabs-beta/EmberQL/blob/dev/LICENSE)
## What is EmberQL?

EmberQL is an intuitive, lightweight Node module that facilitates caching data from GraphQL queries, and implements a dynamic data persistence system that monitors the status of the primary database and modifies cache invalidation accordingly.
## Features

 ### Server-side caching with Redis to decrease query times
 Decrease the time it takes for your users to fetch data from your database by up to one hundred fold. Research shows that even a second of latency will drastically increase bounce rates on your application. Additionally, depending on the specifications or hosting of your database, too many simultaneous queries can cause timeouts to occur. Using EmberQL, there is no need to gamble with forcing your users to make redundant queries to your database.
 
 ### Dynamic cache invalidation
 EmberQL incorporates a smart "heartbeat" feature that will monitor your database in real time and halt cache invalidation when it detects downtime. This is done by periodically increasing the time to live of cached data, and as soon as the database comes back online cached items will revert to being evicted normally. The heartbeat will communicate relevant information to the developer in the server console. 
 
 
 ### Data persistence system utilizing **RDB** (Redis Database) and **AOF** (Append Only File)
 In the event of your database going down, the most relevant information users are querying will be available in the in-memory database and thus available to users. With EmberQL, there is no need for your clients to notice when your database isn't running. You can rest assured that your application will have fault tolerance after installing the module. 
 
## Installation & Prerequisites
You can install the EmberQL module into your Node.js application by running the command npm install emberql. Your application must have GraphQL and as a dependency, and you will need to define your schema so that EmberQL can make use of it. You will also need Redis as a dependency to access the Redis functions (createClient, connect, on, etc.) and you will need to either run a Redis server on your machine locally or utilize AWS Elasticache to run a Redis server. 
## Implementation
You
The EmberQL class will take your GraphQL schema and your Redis cache instance as arguments:
```
const Ember = new EmberQL(schema, redisCache);
```
Any request sent to '/graphql' should be routed through the handleQuery middleware:
```
app.use('/graphql', Ember.handleQuery, (req, res) => {
  res.status(202).json(res.locals.data);
});
```
To clear the Redis cache, send a request to the '/clearCache' endpoint and route it through the EmberQL clearCache method:
```
app.use('/clearCache', Ember.clearCache, (req, res) => {
  res.sendStatus(202);
});
```
## Features in Production
Data normalization for Redis caching is currently in our development pipeline. The prototype utilizes a recursive function to parse the GraphQL AST and transform queries into key value pairs utilizing hashing to optimize memory. 

## EmberQL Engineering Team

[Cristian De Los Rios](https://github.com/Cristian-DeLosRios) | 
[Manjunath Ajjappa Pattanashetty](https://github.com/manjunathap85) | 
[Mike Masatsugu](https://github.com/mikemasatsugu) | 
[Ram Marimuthu](https://github.com/rammarimuthu) | 
[Tyler Pohn](https://github.com/tylerpohn)
