// Load Environment Variables from .env file
require('dotenv').config();
let port     = process.env.NODE_PORT;
let logLevel = process.env.NODE_LOG_LEVEL;

let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');

let auth = require('./utils/auth');
let session = require('./models/session');
let jsonUtils = require('./utils/json');
let users = require('./routes/users');

let app = express();

app.use(logger(logLevel));
app.use(bodyParser.json());
app.use(jsonUtils.requestMiddleware);
app.use(jsonUtils.responseMiddleware);

users.register('/users/', app, auth.middleware);

app.listen(port, function() {
  console.log("Node app " + __filename + " is listening on port " + port + "!");
});

module.exports = app;
