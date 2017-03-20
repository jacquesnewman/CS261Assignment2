module.exports.begin = (realm) => {
    let result = {
        frame: 0,
        fps: 10,

        gameloop() {
            this.frame += 1;
        }
    };

    setInterval(result.gameloop, 1000 / result.fps);

    return result;
}