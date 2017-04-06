define(function(require) {
    let _socket;
    let _session;
    let _frameClass;

    let _this = {
        isJoined: false,
        frameNum: 0,
        frames: [ ],
        framesReceived: 0,
        blankFrame: null,

        begin: function (config, callback) {
            console.log('begun');

            _socket = config.socket;
            _session = config.session;
            _frameClass = config.frame;

            _socket.onmessage = (event) => {
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

            this.blankFrame = _frameClass.createFrame();

            return callback(null, _this);
        },

        receive: function(message) {
            if (message.substr(0,4) == 'FRAM')
            {
                let newframe = _frameClass.parseFrame(message.substr(4));
                if (newframe.frameNum)
                    this.frames[newframe.frameNum] = newframe;
                this.framesReceived += 1;

                if (!this.frameNum && this.framesReceived > 1)
                    this.frameNum = this.frames.length - 2;
            }
        },

        send: function(message) {
            _socket.send(message);
        },

        sendControls: function(controls) {
            let payload = 'MOVE' + this.frameNum + '|' + JSON.stringify(controls);
            this.send(payload);
        },

        nextFrame: function (togo) {
            if (this.frameNum <= 0)
                return this.blankFrame;


            return this.frames[this.frames.length - 1];
            /*
            if (togo < 0)
            {
                this.frameNum += 1;
                togo = 0;
            }

            let frame0 = this.frames[this.frameNum];
            let frame1 = this.frames[this.frameNum + 1];

            if (!frame0 || !frame1)
            {
                console.log(this.frameNum);
                return this.blankFrame;
            }

            return _frameClass.lerpFrames(frame0, frame1, togo);
            */
        }
    };

    return _this;
});
