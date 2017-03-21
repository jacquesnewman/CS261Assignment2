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

function handleConnectionSequence(message, channel) {
    console.log(message);

    if (message.length < 4)
        return;

    switch (message.substr(0, 4)) {
        case 'HELO':
            channel.sessionID = message.substr(4);
            if (!channel.nonce)
                channel.nonce = Math.floor(Math.random() * 99999999) + 1;
            channel.send('AUTH' + nonce);
            break;

        case 'JOIN':
            auth.verifyToken(channel.sessionID, channel.nonce, message.substr(4), (err, result) => {
                if (result)
                {
                    channel.send('WLCM');
                    // TODO
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

                onReceive: (payload) => {
                    let message = payload;
                    console.log(message);
                    switch (this.state) {
                        case StateEnum.Authenticated:
                            inbound.push(message);
                            break;

                        case StateEnum.Connected:
                            handleConnectionSequence(message, this.connection);
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

            return channel;
        }
    };
    return result;
}
