let users = require('../models/user');
let auth = require('../utils/auth');
let common = require('../utils/common');
let util = require('util');
let moment = require('moment');
let io = require('socket.io');

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
    _server = io(server);

    _server.on('connection', (socket) => {
        console.log('CONNECTION ' + socket.id);

        socket.on('disconnect', () => {
            console.log('DISCONNECTION ' + socket.id);
        });
    });
}

//hmm