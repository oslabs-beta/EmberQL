import path from 'path';
import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema';
import cors from 'cors';
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());
// statically serve everything in the build folder on the route '/build'
console.log(
  'Should print MinifiedUglified build:',
  path.resolve(__dirname, './build'),
);

//eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.use('/build', express.static(path.resolve(__dirname, './build')));
//app.use('/', express.static(path.resolve(__dirname, './client')));
// app.use('/', (req: Request, res: Response) => {
//   return res.status(200).sendFile(path.join(__dirname, '../client/index.tsx'));
// });

// serve index.html on the route '/'
//express.static is replacing the following: (because html gets bundled)
app.get('/', (req: Request, res: Response) =>
  res.status(200).sendFile(path.join(__dirname, '../index.html')),
);

app.listen(PORT); //listens on port 3000 -> http://localhost:3000/
console.log(`Listening on port ${PORT}...`);
