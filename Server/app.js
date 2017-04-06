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

app.use(logger(logLevel));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(jsonUtils.requestMiddleware);
app.use(jsonUtils.responseMiddleware);

// Calls made on user-name.cs261.net/api/v1/...
// - Requires nginx rule on ports 80 and 443
// - Example: <domain>/api/v1/users/... is passed into this node app as /users/...
users.register('/users/', app, auth.middleware);
// register inventory, etc...

let server = app.listen(port, () => {
  console.log("Node app " + __filename + " is listening on port " + port + "!");

  // Websockets are listening on the same port as this app.
  // port 9009 is used in nginx go capture requests intended for websocket
  gameserver.registerWebsockets(server);
});

module.exports = app;
