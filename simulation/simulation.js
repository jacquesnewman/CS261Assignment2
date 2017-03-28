const stringify = require('json-stringify-safe');

module.exports.begin = () => {
    let result = {
        processInput(messages) {
            if (messages)
                console.log(stringify(messages));

        },

        advanceSimulation(interval) {

        },

        assembleFrame() {
            return { };
        }
    };

    return result;
}