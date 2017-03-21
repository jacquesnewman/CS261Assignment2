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

const StateEnum = {
    Connected: 1,
    Authenticated: 2,
    Disconnected: -1
};

module.exports.begin = (reliabilityLayer) => {
    let result = {
        reliabilityLayer: reliabilityLayer,
        channels: { },

        accept(connection) {
            let inbound = [ ];
            let state = StateEnum.Connected;

            let channel = {
                id: connection.id,
                connection: connection,

                send: (message) => {
                    connection.send(message);
                },

                onReceive: (message) => {
                    switch (this.state) {
                        case StateEnum.Joined:
                            inbound.push(message);
                            break;

                        case StateEnum.Connected:
                            // Check for auth then join
                            break;

                        default:
                            // Ignore!
                            break;
                    }
                },

                onClose: () => {
                    this.state = StateEnum.Disconnected;
                    delete result.channels[this.id];
                },

                receive: () => {
                    let received = inbound;
                    inbound = [ ];
                    return received;
                }
            };
            result.channels[channel.id] = channel;
        }
    };
    return result;
}
