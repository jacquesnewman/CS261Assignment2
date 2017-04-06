define(function(require) {
    let _atlas = null;


    function spriteForObject(obj) {
        let art = null;
        let anchor = { x: 0.5, y: 0.5 };
        let scale = { x: 0.4, y: 0.4 };
        let frames = null;

        switch (obj.type)
        {
            case "blueShip":
                art = "playerShip1_blue.png";
                break;

            case "exhaust":
                frames = [ ];
                anchor = { x: 0.5, y: 0 };
                let indices = [ 3, 6, 7, 6, 3, 6, 2, 3, 7, 6 ];
                for (let i = 0; i < indices.length; i++)
                {
                    let name = "00" + indices[i];
                    name = "Effects/fire" + name.substr(name.length - 2);
                    name = name + ".png";
                    frames.push(PIXI.Texture.fromFrame(name));
                }
                break;

            default:
                break;
        }

        let sprite = null;
        if (art) {
            sprite = new PIXI.Sprite(_atlas.textures[art]);
        }
        else if (frames) {
            sprite = new PIXI.extras.AnimatedSprite(frames);
            sprite.animationSpeed = 3;
            sprite.play();
        }

        if (sprite) {
            sprite.anchor.x = anchor.x;
            sprite.anchor.y = anchor.y;
            sprite.scale.x = scale.x;
            sprite.scale.y = scale.y;
        }
        return sprite;
    }

    let _this = {
        begin: function (config) {
            _atlas = config.atlas;
        },

        createSprite: function(obj) {
            let sprite = spriteForObject(obj);
            return sprite;
        }

    };

    return _this;
});
