let users = require('../models/user');
let auth = require('../utils/auth');
let common = require('../utils/common');
let util = require('util');
let moment = require('moment');

let _root = '/';

function handleError(res, err) {
    console.log(util.inspect(err));
    return common.sendStatusCode(res, 500, "Internal server error");
}

function doCreate(req, res, next) {
    let params = common.verifyParameters(req, [ "username", "password" ], [ "avatar" ]);
    let result = { };

    if (params.status != "success")
        return common.sendJSON(res, params);

    users.create(params.data.username, params.data.password, (err, result) => {
        if (err == "Already taken")
            return common.sendResponse(res, { username: err });
        
        if (params.data.avatar) {
            result.avatar = params.data.avatar;
            result.save((err) => {
                if (err)
                    return handleError(res, err);

                return common.sendResponse(res, null, { id: result.id, username: result.username });
            });
        }
        else
            return common.sendResponse(res, null, { id: result.id, username: result.username });
    });
}

function doLogin(req, res, next) {
    let params = common.verifyParameters(req, [ "username", "password" ]);
    if (params.status != "success")
        return common.sendJSON(res, params);

    auth.authenticate(params.data.username, params.data.password, (err, session) => {
        if (err == "Unauthorized")
            return common.sendJSON(res, { status: "fail", reason: "Username/password mismatch" });
        else if (err)
            return handleError(res, err);

        session.loggedIn = moment();
        session.save((err) => {
            if (err)
                return handleError(res, err);

            return common.sendResponse(res, null, { id: session.id, session: session.session, token: session.token });
        });
    });
}

function doLogout(req, res, next) {
    req.session.destroy((err) => {
        if (err)
            return handleError(res, err);

        let duration = moment.duration(moment().diff(req.session.loggedIn));
        return common.sendResponse(res, null, { duration: duration.asSeconds() });
    });
}

function doGet(req, res, next) {
    let id = req.params.id;
    users.findId(id, (err, found) => {
        if (err == "Not found")
            return common.sendResponse(res, { "id": "Not found" });
        else if (err)
            return handleError(res, err);
        else
            return common.sendResponse(res, null, { found.id, found.username, found.avatar });
    });
}

function doFind(req, res, next) {
    let username = req.params.username;
    users.findUsername(username, (err, found) => {
        if (err == "Not found")
            return common.sendResponse(res, { "username": "Not found" });
        else if (err)
                return handleError(res, err);
            else
                return common.sendResponse(res, null, { found.id, found.username, found.avatar });
    });
}

function doUpdate(req, res, next) {

}

module.exports.register = (root, app, authMiddleware) => {
    _root = root;

    app.post(_root + 'create', doCreate);
    app.all(_root + 'login', doLogin);
    app.post(_root + 'logout', authMiddleware, doLogout);
    app.all(_root + ':id/get', authMiddleware, doGet);
    app.all(_root + 'find/:username', authMiddleware, doFind);
    app.post(_root + ':id/update', authMiddleware, doUpdate);
}
