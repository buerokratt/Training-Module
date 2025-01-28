import express from "express";
const app = express();

import opensearch from "./pipelines/opensearch.js";

const PORT = process.env.PORT || 3010;
const REQUEST_SIZE_LIMIT = "100mb";

app.disable('x-powered-by');
app.use(express.json({ limit: REQUEST_SIZE_LIMIT }));
app.use(express.urlencoded({ limit: REQUEST_SIZE_LIMIT, extended: true }));

app.use(opensearch);

app.listen(PORT, () => {
  console.log(`${process.argv[1]} listening on port ${PORT}`);
});
