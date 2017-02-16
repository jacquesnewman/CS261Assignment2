let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let auth = require('./utils/auth');
let session = require('./utils/auth');
let users = require('./routes/users');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.use(session.middleware);

users.register('/users/', app, auth.middleware);

module.exports = app;
