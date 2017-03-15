let users = require('../models/user');
let auth = require('../utils/auth');
let common = require('../utils/common');
let util = require('util');
let moment = require('moment');
let ws = require('ws');
let stringify = require('json-stringify-safe');


let _root = '/';
let _server = null;

function doTestSocket(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.render('gameserver/landing', { });
}

function doClient(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.render('gameserver/client', { session: req.session });
}

function broadcast(msg) {
    _server.clients.forEach( (client) => {
        client.send(msg);
    });
}

module.exports.register = (root, app, authMiddleware) => {
    _root = root;

    app.all(_root, authMiddleware, doClient);
    app.all(_root + 'testsocket', authMiddleware, doTestSocket);
}

module.exports.listen = (server) => {
    _server = new ws.Server({ server: server, perMessageDeflate: false });

    let first = new Date().valueOf();

    _server.on('connection', (socket) => {
        first = new Date().valueOf();

        socket.on('message', (data, flags) => {
            console.log("RECV " + data);
        });

        socket.on('close', () => {

        });
    });

    setInterval(() => {
        broadcast((new Date().valueOf()) - first);
    }, 100);
}
