const stringify = require('json-stringify-safe');

module.exports.begin = (server, channelLayer) => {
    let result = {
        server: server,
        channelLayer: channelLayer,
        nextID: 1,
        connections: { }
    };

    result.server.on('connection', (socket) => {
        let connection = {
            id: result.nextID,

            send: (message) => {
                socket.send(message);
            },

            isConnected: true
        };
        result.connections[connection.id] = connection;
        result.nextID += 1;

        socket.on('message', (data, flags) => {
            socket.send('hey you said ' + data);
            console.log('network.socket.onmessage ' + data);
            connection.channel.onReceive(data);
        });

        socket.on('close', () => {
            console.log('network.socket.onclose');
            connection.isConnected = false;
            delete result.connections[connection.id];
            connection.channel.onClose();
        });

        socket.on('open', () => {
            connection.channel = result.channelLayer.accept(connection);
        });
    });

    return result;
}

