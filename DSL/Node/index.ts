import express, { Express } from 'express';
import convert from './convert';
import file from './file';
import merge from './merge';

const app: Express = express();
const port = 3000

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
app.use('/convert', convert);
app.use('/file', file);
app.use('/merge', merge);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
