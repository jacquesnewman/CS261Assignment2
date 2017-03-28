const stringify = require('json-stringify-safe');

//"MOVE{\"THRUST\":{\"down\":false,\"held\":false,\"released\":false},\"LEFT\":{\"down\":false,\"held\":false,\"released\":false},\"RIGHT\":{\"down\":false,\"held\":false,\"released\":false},\"FIRE\":{\"down\":false,\"held\":false,\"released\":false}}"]

module.exports.begin = (frameRate) => {
    let _ships = { };
    let _stats = { };

    function makeControls() {
        return {
            THRUST: false,
            LEFT: false,
            RIGHT: false,
            FIRE: false
        };
    }

    function getStats(type) {
        let result = _stats[type];
        if (!result)
        {
            result = {
                rotationRate: 36,
                thrust: 9.8,
                limit: 50
            };
            _stats[type] = result;
        }
        return result;
    }

    function getShip(id) {
        let result = _ships[id];
        if (!result)
        {
            result = {
                id: 'player' + id,
                type: 'blueShip',
                pos: { x: 0, y: 0 },
                v: { x: 0, y: 0 },
                rot: 0,
                controls: makeControls()
            }

            _ships[id] = result;
        }
        return result;
    }

    function strip(obj) {
        return {
            id: obj.id,
            type: obj.type,
            pos: obj.pos,
            rot: obj.rot
        };
    }

    function allShips() {
        let result = [ ];
        for (let key in _ships)
        {
            result.push(_ships[key]);
        }
        return result;
    }

    function forEachPlayer(func) {
        for (let key in _ships)
        {
            let ship = _ships[key];

            if (ship)
                func(key, ship);

            ship.controls = makeControls();
        }
    }

    function normalizeAngle(angle) {
        while (angle <= -180) angle += 360;
        while (angle > 180) angle -= 360;
        return angle;
    }

    function deg2Rad(degrees) {
        return degrees * Math.PI / 180;
    };

    function rad2Deg(radians) {
        return radians * 180 / Math.PI;
    };

    function Vec2D(x, y) {
        if (!y && x.x && x.y)
        {
            this.x = x.x;
            this.y = x.y;
        }
        else
        {
            this.x = x;
            this.y = y;
        }

        this.stripped = function () {
            return { x: this.x, y: this.y };
        }

        this.times = function(scalar) {
            return new Vec2D(this.x * scalar, this.y * scalar);
        }

        this.plus = function(vec) {
            return new Vec2D(this.x + vec.x, this.y + vec.y);
        }

        this.normalized = function(scale) {
            let length = Math.sqrt((this.x * this.x) + (this.y * this.y));
            if (scale > 0)
                length = scale / length;
            else
                length = 1 / length;

            return new Vec2D(this.x * length, this.y * length);
        }
    }

    function normalVectorFromAngle(angle) {
        let radians = deg2Rad(angle);
        return new Vec2D(Math.cos(radians), Math.sin(radians));
    }

    let result = {
        processInput(clients) {
            for (let key in clients)
            {
                let messages = clients[key].messages;
                if (messages && messages.length > 0)
                {
                    let ship = getShip(clients[key].id);
                    let controls = ship.controls;
                    for (let i = 0; i < messages.length; i++)
                    {
                        if (messages[i].substr(0,4) == 'MOVE')
                        {
                            let payload = JSON.parse(messages[i].substr(4));
                            for (let key in controls)
                            {
                                if (payload[key])
                                    controls[key] |= payload[key].down;
                            }
                        }
                    }
                }
            }
        },

        advanceSimulation(interval) {
            forEachPlayer((key, ship) => {
                let stats = getStats(ship.type);
                let controls = ship.controls;


                if (controls.LEFT)
                {
                    console.log(JSON.stringify(ship));
                    ship.rot -= interval * stats.rotationRate;
                    console.log(interval);
                    console.log(stats.rotationRate);
                }
                if (controls.RIGHT)
                    ship.rot += interval * stats.rotationRate;
                ship.rot = normalizeAngle(ship.rot);

                /*let pos = new Vec2D(ship.pos);
                let v = new Vec2D(ship.v);

                if (controls.THRUST)
                {
                    let accel = normalVectorFromAngle(ship.rot).times(stats.thrust * interval);
                    v = v.plus(accel);
                    v = v.normalized(stats.limit);
                }

                pos = pos.plus(v.times(interval));

                ship.v = v.stripped();
                ship.pos = pos.stripped();*/
            });
        },

        assembleFrame() {
            let ships = allShips();

            let result = [ ];

            for (let i = 0; i < ships.length; i++)
                result.push(strip(ships[i]));

            return { objects: result };
        }
    };

    return result;
}