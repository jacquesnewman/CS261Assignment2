let users = require('../models/user');
let sessions require('../models/session');
let guid = require('guid');

module.exports.middleware = function(req, res, next) {
    if (!req.body._session)
        return res.send(JSON.stringify({ status: "fail", reason: { "_token" : "Invalid" } }));
    
    sessions.findId(req.body._session, (err, found) => {
        if (!found || found._token != req.body._token)
            return res.send(JSON.stringify({ status: "fail", reason: { "_token" : "Invalid" } }));
        else
        {
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
        else
        {
            sessions.create((err, result) => {
                if (err)
                    return callback(err);
                else
                {
                    result._token = guid.create();
                    return result.save((err) => {
                            if (err)
                                return callback(err);
                            else
                                return callback(null, true);
                        });
                }
            });
        }
    });
}