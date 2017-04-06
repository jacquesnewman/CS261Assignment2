define(function(require) {
    let _lastState = { };
    let _curState = { };

    let _codes = { };

    function onKeyDown(evt) {
        for (var control in _codes) {
            for (let i = 0; i < _codes[control].length; i++)
            {
                if (evt.keyCode == _codes[control][i])
                {
                    _curState[control] = 1;
                    evt.preventDefault();
                }
            }
        }
    }

    function onKeyUp(evt) {
        for (var control in _codes) {
            for (let i = 0; i < _codes[control].length; i++)
            {
                if (evt.keyCode == _codes[control][i])
                {
                    _curState[control] = 0;
                    evt.preventDefault();
                }
            }
        }
    }

    let _this = {
        begin: function (config) {
            if (config && config.controls)
            {
                _codes = config.controls;
            }

            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);

            return {};
        },

        getState: function () {
            let state = { };

            let debugDirty = false;

            for (var control in _codes) {
                let report = { down: false, held: false, released: false };
                state[control] = report;

                if (_curState[control] > 0)
                {
                    debugDirty = true;

                    report.down = true;
                    if (_lastState[control] > 0)
                        report.held = true;
                }
                else
                {
                    report.down = false;
                    if (_lastState[control] > 0)
                    {
                        report.released = true;
                        debugDirty = true;
                    }

                    _curState[control] = 0;
                }
            }

            _lastState = JSON.parse(JSON.stringify(_curState));

            return state;
        }
    };

    return _this;
});
