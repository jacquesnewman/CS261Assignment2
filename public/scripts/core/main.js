define(function(require) {
    return {
        begin(config, socket) {
            socket.onopen = function(event) {

                console.log("made it!");
                console.log(JSON.stringify(config));
                console.log(socket);

                require([   './renderer.js',
                        './network.js',
                        './keyboard.js',
                        './spritemanager.js',
                        './frame.js'],
                    function(renderer, network, keyboard, spriteManager, frame) {
                        // create an new instance of a pixi stage
                        let stage = new PIXI.Stage(0);

                        // create a renderer instance.
                        let canvas = PIXI.autoDetectRenderer(600, 600);
                        canvas.backgroundColor = 0xFF00FF;

                        document.body.appendChild(canvas.view);
                        canvas.view.style.position = 'absolute';
                        canvas.view.style.left = '50%';
                        canvas.view.style.top = '50%';
                        canvas.view.style.transform = 'translate3d( -50%, -50%, 0 )';

                        renderer.begin({
                            stage: stage,
                            canvas: canvas,
                            spriteManager: spriteManager,
                            background: '/assets/art/nebula.jpg',
                            atlas: "/assets/art/Spritesheet/atlas.json" }, function(err) {

                            network.begin({ frame: frame, socket: socket, session: config }, function(err) {
                                keyboard.begin({ controls: {
                                    THRUST: [ 87, 38 ],
                                    LEFT: [ 65, 37 ],
                                    RIGHT: [ 68, 39 ],
                                    FIRE: [ 32 , 17 ]
                                }
                                });

                                const desiredRate = 1 / 60;
                                let remainingTime = 0;

                                requestAnimationFrame( animate );

                                function animate(elapsedTime) {
                                    requestAnimationFrame( animate );

                                    remainingTime -= elapsedTime;
                                    if (remainingTime <= 0) {
                                        // Get and send keyboard input
                                        let state = keyboard.getState();
                                        network.sendControls(state);
                                        remainingTime = desiredRate;
                                    }

                                    renderer.draw(network.nextFrame());

                                    canvas.render(stage);
                                }
                            });
                        });
                    });
            }
        }
    }
});

