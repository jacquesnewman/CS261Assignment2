module.exports.begin = (server, channelLayer) => {
    let result = {
        server: server,
        channelLayer: channelLayer,
        nextID: 1,
        connections: { }
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

