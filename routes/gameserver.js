let users = require('../models/user');
let auth = require('../utils/auth');
let common = require('../utils/common');
let util = require('util');
let moment = require('moment');
let io = require('socket.io');

let _root = '/';
let _server = null;

function doLanding(req, res, next) {
    res.render('gameserver/landing', { });
}

module.exports.register = (root, app, authMiddleware) => {
    _root = root;

    app.all(_root, doLanding);
}

module.exports.listen = (server) => {
    _server = io(server);

    _server.on('connection', (socket) => {
        console.log('CONNECTION ' + JSON.stringify(socket));

        socket.on('disconnect', () => {
            console.log('DISCONNECTION');
        });
    });
}

//hmm