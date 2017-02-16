let users = require('../models/user');
let auth = require('../utils/auth');

let _root = '/';

function compose_response(res, err, payload) {
    if (err)
        return res.send(JSON.stringify({ status: "fail", reason: err }));
    else
        return res.send(JSON.stringify({ status: "success", data: payload }));
}

function do_create(req, res, next) {
    let result = { };

    let required = [ "username", "password" ];

}

function do_login(req, res, next) {

}

function do_logout(req, res, next) {

}

function do_get(req, res, next) {

}

function do_find(req, res, next) {

}

function do_update(req, res, next) {

}

module.exports.register = (root, app, authMiddleware) => {
    _root = root;

    app.post(_root + 'create', do_create);
    app.all(_root + 'login', do_login);
    app.post(_root + 'logout', authMiddleware, do_logout);
    app.all(_root + ':id/get', authMiddleware, do_get);
    app.all(_root + 'find/:username', authMiddleware, do_find);
    app.post(_root + ':id/update', authMiddleware, do_update);
}
