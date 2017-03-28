module.exports.begin = (realm) => {
    let result = {
        realm: realm,

        join(reliability) {
            reliability.send('replication');
            reliability.replication = {
                layer: this,
                realm: realm,
                
                getID() {
                    return reliability.getID(); 
                },

                sendFrame(frame) {
                    let payload = 'FRAM';
                    
                    // Serialize frame and append to payload

                    reliability.send(payload, frame.frameNumber);
                },

                send(message) {
                    reliability.send(message);
                },

                receive() {
                    return reliability.receive();
                },

                disconnect() {
                    return reliability.disconnect();
                }
            };

            realm.join(reliability.replication);
        }
    };

    return result;
}

