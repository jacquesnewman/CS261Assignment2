module.exports.begin = (prioritizationLayer) => {
    let result = {
        join(channel) {
            channel.reliability = {
                layer: this,
                channel: channel,
                lastFrameAcked: 0,

                send(message) {
                    channel.send(message);
                },

                receive() {
                    let inbound = channel.receive();
                    for (let i = 0; i < inbound.length; i++)
                    {
                        if (inbound[i].substr(0,4) == 'MOVE')
                        {
                            let payload = inbound[i].substr(4).split('|', 1);
                            let acked = Number(payload[0]);
                        }
                    }
                }
            };
        }
    };
}

