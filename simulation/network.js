const stringify = require('json-stringify-safe');

module.exports.begin = (server, channelLayer) => {
    let result = {
        server: server,
        channelLayer: channelLayer,
        nextID: 1,
        connections: { }
    };

    function end(connection) {
        connection.isConnected = false;
        delete result.connections[connection.id];
        connection.channel.onClose();
    }

    result.server.on('connection', (socket) => {
        let connection = {
            id: result.nextID,

            send: (message) => {
                socket.send(message);
            },

            isConnected: true,

            close: () => {
                socket.close();
            }
        };
        result.connections[connection.id] = connection;
        result.nextID += 1;

        socket.on('message', (data, flags) => {
            connection.channel.onReceive(data);
        });

        socket.on('error', (error) => {
            end(connection);
        });

        socket.on('close', () => {
            end(connection);
        });

        connection.channel = result.channelLayer.accept(connection);
    });

    return result;
}

