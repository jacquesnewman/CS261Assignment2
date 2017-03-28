const stringify = require('json-stringify-safe');

module.exports.begin = () => {
    let result = {
        processInput(clients) {
            for (let key in clients)
            {
                let messages = clients[key].messages;
                if (messages && messages.length > 0)
                    console.log(clients[key].id + ' => ' + stringify(messages));
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