let simulation = require('./simulation');

module.exports.begin = (realm) => {
    const fps = 10;

    let result = {
        simulation: simulation.begin(1 / fps),
        frameNum: 1,
        fps: fps,

        gameloop() {
            this.simulation.processInput(realm.collect());
            this.simulation.advanceSimulation(1000 / this.fps);
            let curFrame = this.simulation.assembleFrame();
            curFrame.frameNumber = this.frameNum;
            realm.broadcast(curFrame);
            this.frameNum += 1;
        }
    };

    setInterval(() => { result.gameloop(); }, 1000 / result.fps);

    return result;
}