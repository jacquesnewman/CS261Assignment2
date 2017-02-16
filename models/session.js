let guid = require('guid');

let _sessions = { };

module.exports.create = function(callback) {
    let result = { id: guid.create() };
    result.save = (callback) => {
        process.nextTick(() => { callback(null); });
    };

    _sessions[result.id] = result;
    return process.nextTick(() => { callback(null, result); });
}

module.exports.findId = function(id, callback) {
    let result = _sessions[id];
    if (!result)
        return process.nextTick(() => { callback("Not found"); });
    else
        return process.nextTick(() => { callback(null, result); });
}