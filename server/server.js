const config = require("./config");
const http = require("http");
const express = require("express");
const run = require("./services");

const app = express();
const server = http.createServer(app);

/**
 * Run worker threads to subscribe and save data
 */
run().catch(err => console.error(err));

/**
 * Start server
 */
server.listen(config.port, function() {
  console.info(
    `${config.appName} listening on: http://localhost:${config.port}`
  );
});

module.exports = server;
