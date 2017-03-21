module.exports.begin = (server, channelLayer) => {
    let result = {
        server: server,
        channelLayer: channelLayer,
        nextID: 1,
        connections: { }
    };

    result.server.on('connection', (socket) => {
        console.log('socket connected');
        let connection = {
            id: result.nextID,

            send: (message) => {
                socket.send(message);
            },

            isConnected: true
        };
        result.connections[connection.id] = connection;
        result.nextID += 1;
        connection.channel = result.channelLayer.accept(connection);

        socket.on('message', (data, flags) => {
            connection.channel.onReceive(data);
        });

        socket.on('close', () => {
            connection.isConnected = false;
            delete result.connections[connection.id];
            connection.channel.onClose();
        });
    });

    return result;
}

