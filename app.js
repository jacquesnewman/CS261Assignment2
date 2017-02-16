let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let auth = require('./utils/auth');
let session = require('./models/session');
let jsonUtils = reuire('./utils/json');
let users = require('./routes/users');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(jsonUtils.requestMiddleware);
app.use(jsonUtils.responseMiddleware);
app.use(session.middleware);

users.register('/users/', app, auth.middleware);

module.exports = app;
