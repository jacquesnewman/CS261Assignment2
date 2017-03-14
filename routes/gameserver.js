let users = require('../models/user');
let auth = require('../utils/auth');
let common = require('../utils/common');
let util = require('util');
let moment = require('moment');
let ws = require('ws');

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

    _server.on('connection', (socket) => {
        console.log('CONNECTION ' + JSON.stringify(socket));

        socket.on('close', () => {
            console.log('DISCONNECTION ' + JSON.stringify(socket));
        });
    });

    setInterval(() => {
        _server.clients.forEach( (client) => {
            client.send(new Date());
        });
    }, 100);
}
