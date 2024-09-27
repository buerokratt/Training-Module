const express = require("express");
const cors = require("cors");
const { buildSSEResponse } = require("./sseUtil");
const { serverConfig } = require("./config");
const { buildNotificationSearchInterval } = require("./addOns");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

const app = express();

app.use(cors({ origin: "*" }));
app.use(helmet.hidePoweredBy());
app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(csurf({ cookie: { httpOnly: true }, ignoreMethods: ["GET", "POST"] }));

app.get("/sse/notifications/:channelId", (req, res) => {
  const { channelId } = req.params;
  buildSSEResponse({
    req,
    res,
    buildCallbackFunction: buildNotificationSearchInterval({ channelId }),
  });
});

const server = app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`);
});

module.exports = server;
