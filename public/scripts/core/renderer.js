define(function(require) {
    let _sprites = { };
    let _background = null;
    let _worldOrigin = { x: 0, y: 0 };

    let _stage = null;
    let _canvas = null;
    let _spriteManager = null;

    function getSprite(obj) {
        let sprite = _sprites[obj.id];
        if (!sprite)
        {
            sprite = _spriteManager.createSprite(obj);
            _stage.addChild(sprite);
            _sprites[obj.id] = sprite;
        }
        return sprite;
    }

    let _this = {
        setOrigin: function(origin) {
            _worldOrigin.x = origin.x;
            _worldOrigin.y = origin.y;
        },
        getOrigin: function() {
            return { x: _worldOrigin.x, y: _worldOrigin.y };
        },

        begin: function(config, callback) {
            _stage = config.stage;
            _canvas = config.canvas;
            _spriteManager = config.spriteManager;

            let action = PIXI.loader.add(config.atlas);
            if (config.background)
                action = action.add(config.background);

            action.load(function() {
                _spriteManager.begin({ atlas: PIXI.loader.resources[config.atlas] });

                if (config.background)
                {
                    _background = new PIXI.Sprite(PIXI.utils.TextureCache[config.background]);
                    _background.anchor.x = 0.5;
                    _background.anchor.y = 0.5;
                    _background.position.x = 0;
                    _background.position.y = 0;
                    _stage.addChild(_background);
                }

                callback(null);
            });
        },

        draw: function(frame) {
            let screenOrigin = {
                x: (_canvas.width * 0.5) - _worldOrigin.x,
                y: (_canvas.height * 0.5) - _worldOrigin.y
            };


            if (_background)
            {
                _background.position.x = (_canvas.width * 0.5) - (_worldOrigin.x * 0.05);
                _background.position.y = (_canvas.height * 0.5) - (_worldOrigin.y * 0.05);
            }

            frame.getAllObjects().forEach( (obj, index, all) => {
                let sprite = getSprite(obj);
                sprite.position.x = obj.pos.x + screenOrigin.x;
                sprite.position.y = obj.pos.y + screenOrigin.y;
                sprite.rotation = obj.rot * (Math.PI / 180);
            });
        }
    };

    return _this;
});
