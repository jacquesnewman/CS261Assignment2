let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let auth = require('./utils/auth');
let session = require('./models/session');
let jsonUtils = require('./utils/json');
let users = require('./routes/users');

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(jsonUtils.requestMiddleware);
app.use(jsonUtils.responseMiddleware);

users.register('/users/', app, auth.middleware);

app.listen(7000);

module.exports = app;
