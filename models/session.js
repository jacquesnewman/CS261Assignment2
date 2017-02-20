let uuid = require('uuid/v4');

let _sessions = { };

module.exports.create = function(callback) {
    let result = { session: uuid() };
    result.save = (callback) => {
        process.nextTick(() => { callback(null); });
    };
    result.destroy = (callback) => {
        delete _sessions[this.session];
        process.nextTick(() => { callback(null, this); });
    }

    _sessions[result.session] = result;
    return process.nextTick(() => { callback(null, result); });
}

module.exports.findId = function(id, callback) {
    let result = _sessions[id];
    if (!result)
        return process.nextTick(() => { callback("Not found"); });
    else
        return process.nextTick(() => { callback(null, result); });
}
