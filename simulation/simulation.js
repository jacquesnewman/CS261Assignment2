const stringify = require('json-stringify-safe');

module.exports.begin = () => {
    let result = {
        processInput(clients) {
            for (let key in clients)
            {
                if (clients[key].messages)
                    console.log(stringify(clients[key].messages));
            }
        },

        advanceSimulation(interval) {

        },

        assembleFrame() {
            return { };
        }
    };

    return result;
}