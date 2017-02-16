let users = require('../models/user');
let auth = require('../utils/auth');

let _root = '/';



module.exports.register = (root, app, authMiddleware) => {
    _root = root;

    app.post(_root + 'create', do_create);
    app.all(_root + 'login', do_login);
    app.post(_root + 'logout', authMiddleware, do_logout);
    app.all(_root + ':id/get', authMiddleware, do_get);
    app.all(_root + 'find/:username', authMiddleware, do_find);
    app.post(_root + ':id/update', authMiddleware, do_update);
}
