module.exports.begin = (replicationLayer) => {
    let result = {
        replicationLayer: replicationLayer,

        join(channel) {
            channel.reliability = {
                layer: this,
                channel: channel,
                lastFrameAcked: 0,
                frameSendTimes: { },
                ping: 0,

                getID() {
                    return channel.getID();
                },

                send(message, frameNumber) {
                    let payload = message;

                    if (frameNumber)
                    {
                        if (!this.frameSendTimes[frameNumber])
                        {
                            this.frameSendTimes[frameNumber] =  process.hrtime();
                        }
                    }

                    channel.send(payload);
                },

                receive() {
                    let messages = channel.receive();
                    let inbound = [ ];
                    for (let i = 0; i < messages.length; i++)
                    {
                        let message = messages[i];
                        if (messages[i].substr(0,4) == 'MOVE')
                        {
                            console.log(messages[i]);
                            let payload = inbound[i].substr(4).split('|', 1);
                            message = 'MOVE' + payload[1];
                            let acked = Number(payload[0]);
                            if (acked)
                            {
                                let toRemove = [ ];
                                for (let frame in this.frameSendTimes)
                                {
                                    if (frame <= acked)
                                    {
                                        let pingHRTime = process.hrtime(this.frameSendTimes[frame]);
                                        toRemove.push(frame);

                                        let curPing = (pingHRTime[0] * 1000) + (pingHRTime[1] / 1000000);
                                        this.ping -= this.ping / 5;     // Rolling average over 5 frames
                                        this.ping += curPing / 5;

                                        console.log(this.ping);
                                    }
                                }

                                // Can't delete them while we're iterating across the object, so delete them now
                                for (let index = 0; index < toRemove.length; index++)
                                    delete this.frameSendTimes[toRemove[index]];

                                if (acked > this.lastFrameAcked)
                                    this.lastFrameAcked = acked;
                            }
                        }

                        inbound.push(message);
                    }

                    return inbound;
                },

                disconnect() {
                    return channel.disconnect();
                }
            };

            replicationLayer.join(channel.reliability);
        }
    };

    return result;
}

