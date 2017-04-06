define(function(require) {
    return {
        begin(config, socket) {
            socket.onopen = function(event) {
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

                                const desiredRate = 1 / 10;
                                let targetTime = 0;

                                requestAnimationFrame( animate );

                                function animate(curTime) {
                                    requestAnimationFrame( animate );

                                    let togo = 1.0 - ((targetTime - curTime) / (desiredRate * 1000));

                                    if (curTime >= targetTime)
                                    {
                                        togo = -1;
                                        
                                        // Get and send keyboard input
                                        let state = keyboard.getState();
                                        network.sendControls(state);
                                        targetTime = curTime + (desiredRate * 1000);
                                    }

                                    renderer.draw(network.nextFrame(togo));

                                    canvas.render(stage);
                                }
                            });
                        });
                    });
            }
        }
    }
});

