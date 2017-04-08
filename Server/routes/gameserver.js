let ws = require('ws');

let networkLayer = require('../simulation/network');
let channelLayer = require('../simulation/channel');
let reliabilityLayer = require('../simulation/reliability');
let replicationLayer = require('../simulation/replication');
let realmLayer = require('../simulation/realm');

let _server = null;
let _root = '/';

/* Note that this module simply serves up the pages that host the game, and organizes and injects the dependencies.
The heavy work is done by the networking stack, which is found in the following files:
    network.js: Handles the raw protocol (WebSockets in our case)
    channel.js: Maintains connection state with one endpoint
    reliability.js: Manages retransmissions (no-op for TCP-based WebSockets) and track RTT
    prioritization.js: Optimizes use of bandwidth
    replication.js: Serializes and deserializes game data
    simulation.js: Handles the game simulation



 Channel: Maintain connection state
 Reliability: Manage retransmission
 Prioritization: Optimize use of bandwidth
 Replication: Serialize/deserialize
 Application: Game logic


 */

module.exports.register = (root, app, authMiddleware) => {
    _root = root;
    app.all(_root, authMiddleware, doTestSocket);
}

module.exports.registerWebsockets = (server) => {
    _server = new ws.Server({ server: server, perMessageDeflate: false });

    let realm = realmLayer.begin();
    let replication = replicationLayer.begin(realm);
    let reliability = reliabilityLayer.begin(replication);
    let channel = channelLayer.begin(reliability);
    let network = networkLayer.begin(_server, channel);
}
