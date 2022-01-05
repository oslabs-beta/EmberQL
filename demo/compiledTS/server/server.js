"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./schema/schema"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
const EmberQL_1 = __importDefault(require("../EmberQL"));
app.use((0, cors_1.default)());
const redis = require('redis');
const redisCache = redis.createClient({
    url: 'redis://emberqluser:Emberql@123@redis-18883.c270.us-east-1-3.ec2.cloud.redislabs.com:18883',
});
redisCache.connect();
redisCache.on('connect', () => {
    console.log('Connected to Redis cache');
});
const Ember = new EmberQL_1.default(schema_1.default, redisCache);
const EmberHeartbeat = Ember.heartbeat;
app.use(express_1.default.json());
// statically serve everything in the build folder on the route '/build'
console.log('Should print MinifiedUglified build:', path_1.default.resolve(__dirname, '../build'));
//eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use('/graphql', Ember.handleQuery, (req, res) => {
    res.status(202).json(res.locals.data);
});
app.use('/clearCache', Ember.clearCache, (req, res) => {
    res.sendStatus(202);
});
app.use('/heartbeat', (0, express_graphql_1.graphqlHTTP)({ schema: schema_1.default }));
//app.use('/build', express.static(path.resolve(__dirname, './build')));
app.use(express_1.default.static('build'));
//app.use('/', express.static(path.resolve(__dirname, './client')));
// app.use('/', (req: Request, res: Response) => {
//   return res.status(200).sendFile(path.join(__dirname, '../client/index.tsx'));
// });
// serve index.html on the route '/'
//express.static is replacing the following: (because html gets bundled)
app.get('/', (req, res) => res.status(200).sendFile(path_1.default.join(__dirname, '../../build/index.html')));
app.listen(PORT); //listens on port 3000 -> http://localhost:3000/
console.log(`Listening on port ${PORT}...`);
// Commenting temporarily during website build (28/12/2021)
// setInterval(() => {
//   EmberHeartbeat();
// }, 3000);
