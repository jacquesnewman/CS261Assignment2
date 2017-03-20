// Load Environment Variables from .env file
require('dotenv').config();
let port     = process.env.NODE_PORT;
let logLevel = process.env.NODE_LOG_LEVEL;

let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

let auth = require('./utils/auth');
let session = require('./models/session');
let jsonUtils = require('./utils/json');
let users = require('./routes/users');
let gameserver = require('./routes/gameserver');

let app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(logger(logLevel));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(jsonUtils.requestMiddleware);
app.use(jsonUtils.responseMiddleware);

users.register('/users/', app, auth.middleware);
gameserver.register('/game/', app, auth.middleware);
gameserver.registerWebsockets(server);

let server = app.listen(port, () => {
  console.log("Node app " + __filename + " is listening on port " + port + "!");
});

module.exports = app;
