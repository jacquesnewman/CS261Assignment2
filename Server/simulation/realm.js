let async = require('async');
let frameHandling = require('./frame');

let _realms = { };

function getRealm(realmID) {
    if (_realms[realmID])
        return _realms[realmID];

    let realm = {
        id: realmID,
        clients: { },

        join(replication) {
            let newid = replication.getID();
            let existing = this.getClient(newid);
            if (existing && existing !== client)
            {
                existing.disconnect();
            }

            this.clients[newid] = replication;
        },

        collect() {
            let results = [ ];
            for (let id in this.clients)
            {
                results.push({ id: id, client: this.clients[id], messages: this.clients[id].receive() });
            }
            return results;
        },

        broadcast(frame) {
            for (let id in this.clients)
            {
                this.clients[id].sendFrame(frame);
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

module.exports.begin = () => {
    let realm = getRealm("default");
    realm.frameHandling = frameHandling.begin(realm);

    return realm;
}