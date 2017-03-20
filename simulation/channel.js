let auth = require('../utils/auth');

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

/*
 Channel: Maintain connection state
 Reliability: Manage retransmission
 Prioritization: Optimize use of bandwidth
 Replication: Serialize/deserialize
 Application: Game logic
 */

module.exports.begin = (reliabilityLayer) => {
    let result = {
        reliabilityLayer: reliabilityLayer,

        accept(connection) {
            
        }
    };

    result.server.on('connection', (socket) => {
        let inbound = [ ];

        let connection = {
            id: result.nextID,

            receive: () => {
                let received = inbound;
                inbound = [ ];
                return received;
            },

            send: (message) => {
                socket.send(message);
            },

            isConnected: true
        };
        result.connections[connection.id] = connection;
        result.nextID += 1;

        socket.on('message', (data, flags) => {
            inbound.push(data);
        });

        socket.on('close', () => {
            connection.isConnected = false;
            delete result.connections[connection.id];
        });

        result.channelLayer.accept(connection);
    });

    return result;
}

