import express from "express";
const app = express();

import opensearch from "./pipelines/opensearch.js";

const PORT = process.env.PORT || 3010;

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(opensearch);

app.listen(PORT, () => {
  console.log(`${process.argv[1]} listening on port ${PORT}`);
});
