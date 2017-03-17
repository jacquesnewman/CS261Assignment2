let auth = require('../utils/auth');
let ws = require('ws');

/*
 The Channel layer is responsible for maintaining connection state.
 This includes handling authentication.
 */


/* Channel connecton: connected, authenticated, joined
 * first connect, then when authenticated can perform other actions
  * default action right now is to automatically join the default realm */

/* for assignment 5 just send every frame
frame number autoincrement
send initial state info about settings like simulation tick rate
client sends back last known frame
send events and state
 */

function getRealm(realmID) {
    if (_realms[realmID])
        return _realms[realmID];

    let realm = {
        id: realmID,
        clients: [ ],
        
        
        connect(socket, callback) {
            
        },
        
        disconnect(socket, callback) {
            
        }
    };
    _realms[realmID] = realm;
    return realm;
}
/*
 Channel: Maintain connection state
 Reliability: Manage retransmission
 Prioritization: Optimize use of bandwidth
 Replication: Serialize/deserialize
 Application: Game logic
 */

module.exports.connect = (socket, realmID) => {
    _root = root;

    app.all(_root, authMiddleware, doClient);
    app.all(_root + 'testsocket', authMiddleware, doTestSocket);
}

module.exports.listen = (server) => {
    _server = new ws.Server({ server: server, perMessageDeflate: false });

    let first = new Date().valueOf();

    _server.on('connection', (socket) => {
        first = new Date().valueOf();

        socket.on('message', (data, flags) => {
            console.log("RECV " + data);
        });

        socket.on('close', () => {

        });
    });

    setInterval(() => {
        broadcast((new Date().valueOf()) - first);
    }, 100);
}
