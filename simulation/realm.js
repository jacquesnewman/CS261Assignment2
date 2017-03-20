let async = require('async');
let simulation = require('./simulation');

let _realms = { };

function getRealm(realmID) {
    if (_realms[realmID])
        return _realms[realmID];

    let realm = {
        id: realmID,
        clients: { },           // array of replication layers

        broadcast(message, callback) {
            let erroredClients = [ ];
            async.each(this.clients, (client, andThen) => {
                client.send(message, (err) => {
                    if (err)
                        erroredClients.push(client.id);
                    andThen(null);
                });
            }, (err) => {
                if (err)
                    return callback(err);
                else if (erroredClients.length > 0) {
                    return callback(erroredClients);
                }
                else
                    return callback(null);
            });
        },

        connect(client, callback) {
            let existing = getClient(client.userid);
            if (existing && existing !== client)
                return process.nextTick(() => { callback("User already connected", existing); });
            else {
                this.clients[client.userid] = channel;
                return process.nextTick(() => { callback(null, client); });
            }
        },

        getClient(userid) {
            return this.clients[userid];
        }
    };
    _realms[realmID] = realm;
    return realm;
}

module.exports.allRealms = () => {
    return Object.keys(_realms).map(key => _realms[key]);
}

module.exports.connect = (client, realmID, callback) => {
    let realm = getRealm(realmID);
    if (!realm)
        return process.nextTick(() => { callback("Realm not found"); });

    return realm.connect(client, callback);
}

module.exports.begin = () => {
    let realm = getRealm("default");
    realm.simulation = simulation.begin(realm);

    return realm;
}