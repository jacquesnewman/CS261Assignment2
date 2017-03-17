let async = require('async');

let _realms = { };

function getRealm(realmID) {
    if (_realms[realmID])
        return _realms[realmID];

    let realm = {
        id: realmID,
        clients: { },           // array of Channels

        broadcast(message, callback) {
            let erroredChannels = [ ];
            async.each(this.clients, (channel, andThen) => {
                channel.send(message, (err) => {
                    if (err)
                        erroredChannels.push(channel.id);
                    andThen(null);
                });
            }, (err) => {
                if (err)
                    return callback(err);
                else if (erroredChannels.length > 0) {
                    return callback(erroredChannels);
                }
                else
                    return callback(null);
            });
        },

        connect(channel, callback) {
            let existing = getChannel(channel.userid);
            if (existing && existing !== channel)
                return process.nextTick(() => { callback("User already connected", existing); });
            else {
                this.clients[channel.userid] = channel;
                return process.nextTick(() => { callback(null, channel); });
            }
        },

        getChannel(userid) {
            return this.clients[userid];
        }
    };
    _realms[realmID] = realm;
    return realm;
}

module.exports.allRealms = () => {
    return Object.keys(_realms).map(key => _realms[key]);
}

module.exports.connect = (channel, realmID, callback) => {
    let realm = getRealm(realmID);
    if (!realm)
        return process.nextTick(() => { callback("Realm not found"); });

    return realm.connect(channel, callback);
}
