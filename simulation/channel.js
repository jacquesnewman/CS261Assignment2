let auth = require('../utils/auth');
const stringify = require('json-stringify-safe');


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
    function handleConnectionSequence(message, channel) {
        if (message.length < 4)
            return;

        switch (message.substr(0, 4)) {
            case 'HELO':
                channel.sessionID = message.substr(4);
                if (!channel.nonce)
                    channel.nonce = Math.floor(Math.random() * 99999999) + 1;
                channel.send('AUTH' + channel.nonce);
                break;

            case 'JOIN':
                auth.verifyToken(channel.sessionID, channel.nonce, message.substr(4), (err, result) => {
                    if (result)
                    {
                        channel.send('WLCM');
                        reliabilityLayer.join(channel);
                    }
                    else
                    {
                        console.log("BAD AUTH " + message.substr(4));
                        channel.connection.close();
                    }
                });
                break;

            default:
                break;
        }
    }

    let result = {
        reliabilityLayer: reliabilityLayer,
        channels: { },

        accept(connection) {
            let inbound = [ ];

            let channel = {
                getID() {
                    return this.id;
                },

                id: connection.id,
                connection: connection,
                state: StateEnum.Connected,

                send(message) {
                    this.connection.send(message);
                },

                onReceive(payload) {
                    let message = payload;
                    console.log(message);
                    switch (this.state) {
                        case StateEnum.Authenticated:
                            inbound.push(message);
                            break;

                        case StateEnum.Connected:
                            handleConnectionSequence(message, this);
                            break;

                        default:
                            // Ignore!
                            break;
                    }
                },

                onClose() {
                    this.state = StateEnum.Disconnected;
                    delete result.channels[this.id];
                },

                receive() {
                    let received = inbound;
                    inbound = [ ];
                    return received;
                },

                disconnect() {
                    return connection.close();
                }
            };
            result.channels[channel.id] = channel;

            return channel;
        }
    };
    return result;
}
