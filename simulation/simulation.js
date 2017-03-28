module.exports.begin = () => {
    let result = {
        processInput(messages) {
            console.log(JSON.stringify(messages));

        },

        advanceSimulation(interval) {

        },

        assembleFrame() {
            return { };
        }
    };

    return result;
}