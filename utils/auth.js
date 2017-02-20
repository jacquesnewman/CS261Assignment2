let users = require('../models/user');
let sessions = require('../models/session');
let guid = require('guid');
let common = require('./common');

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

module.exports.authenticate = function(username, password, callback) {
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
                    result.token = guid.create();
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
