define(function(require) {
    let _curFrame;
    let _socket;
    let _session;

    let _this = {
        isJoined: false,

        begin: function (config, callback) {

            _socket = config.socket;
            _session = config.session;

            _socket.onmessage = function(event) {
                let message = event.data;
                
                if (this.isJoined)
                    return this.receive(message);
                else if (message.substr(0, 4) == 'AUTH')
                {
                    let nonce = message.substr(4);
                    let test ='' + nonce + _session.token + nonce;
                    this.send("JOIN" + sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(test)));
                }
                else if (message.substr(0, 4) == 'WLCM')
                {
                    this.isJoined = true;
                    console.log("Joined!");
                }
            }
            this.send("HELO" + _session.session);

            _curFrame = config.frame;
            _curFrame.addObject(
                {
                    id: 'bunny',
                    type: 'blueShip',
                    pos: { x: 0, y: 0 },
                    rot: 0
                });

            return callback(null, {});
        },

        receive: function(message) {

        },

        send: function(message) {
            _socket.send(message);
        },

        sendControls: function(controls) {

        },

        nextFrame: function () {
            _curFrame.getObject('bunny').rot += 0.1;
            return _curFrame;
        }
    };

    return _this;
});
