const users = require('../models/user');
const sessions = require('../models/session');
const common = require('./common');
const uuid = require('uuid/v4');
const crypto = require('crypto');

module.exports.middleware = function(req, res, next) {
    let authArgs = common.verifyArguments(req, [ "_session", "_token" ], [] );

    if(authArgs.status != 'success')
      return res.send(JSON.stringify({ status: "fail", reason: authArgs.reason }));

    sessions.findId(authArgs.data._session, (err, found) => {
        if (!found || found.token != authArgs.data._token)
            return res.send(JSON.stringify({ status: "fail", reason: { "_token" : "Invalid" } }));
        else {
            req.session = found;
            return next();
        }
    });
}

module.exports.verifyToken = function(session, nonce, submission, callback) {
    sessions.findId(session, (err, found) => {
        if (!found || found.token != token)
            callback(null, false);
        else
        {
            const hash = crypto.createHash('sha256');
            hash.update('' + nonce + token + nonce);

            let result = hash.digest('hex');
            callback(null, result == submission);
        }
    });
}

module.exports.authenticateSession = function(session, token, callback) {
    sessions.findId(session, (err, found) => {
        if (!found || found.token != token)
            return callback("Not found");
        else
            return callback(null, found);
    });
}

module.exports.authenticatePassword = function(username, password, callback) {
    users.findUsername(username, (err, found) => {
        if (err)
            return callback(err);
        else if (!found)
            return callback("Unauthorized");
        else if (found.password != password)
            return callback("Unauthorized");
        else {
            sessions.create((err, result) => {
                if (err)
                    return callback(err);
                else
                {
//                    result.token = uuid();
                    result.token = "demotoken";
                    result.id = found.id;
                    return result.save((err) => {
                            if (err)
                                return callback(err);
                            else
                                return callback(null, result);
                        });
                }
            });
        }
    });
}
