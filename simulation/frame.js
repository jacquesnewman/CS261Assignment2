let simulation = require('./simulation');

module.exports.begin = (realm) => {
    let result = {
        simulation: simulation.begin(),
        frameNum: 1,
        fps: 10,

        gameloop() {
            this.simulation.processInput(realm.collect());
            this.simulation.advanceSimulation(1000 / this.fps);
            realm.broadcast(this.simulation.assembleFrame(), this.frameNum);
            this.frameNum += 1;
        }
    };

    setInterval(result.gameloop, 1000 / result.fps);

    return result;
}