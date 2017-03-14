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
    res.render('gameserver/client', { });
}

module.exports.register = (root, app, authMiddleware) => {
    _root = root;

    app.all(_root, doClient);
    app.all(_root + 'testsocket', doTestSocket);
}

module.exports.listen = (server) => {
    _server = new ws.Server({ server: server, perMessageDeflate: false });
//console.log("1");

    let first = new Date().valueOf();

    _server.on('connection', (socket) => {
        first = new Date().valueOf();

        console.log('CONNECTION ' + stringify(socket));
//        console.log("2");

        socket.on('close', () => {
            console.log('DISCONNECTION ' + stringify(socket));
//            console.log("3");
        });
    });
    console.log("4");

    setInterval(() => {
        console.log("5");
        _server.clients.forEach( (client) => {
            client.send((new Date().valueOf()) - first);
        });
    }, 100);
    console.log("6");
}
