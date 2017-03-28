function Frame() {
    let _objects = [ ];
    let _index = { };

    this.frameNum = 0;

    this.addObject = function(obj) {
        if (!obj || !obj.id)
            return null

        let index = _objects.length;
        if (_index.hasOwnProperty(obj.id))
            index = _index[obj.id];
        else
            _index[obj.id] = index;

        _objects[index] = obj;

        return obj;
    }

    this.getObject = function(id) {
        if (_index.hasOwnProperty(id))
            return _objects[_index[id]];
        else
            return null;
    }

    this.getAllObjects = function() {
        return _objects;
    }
}

define(function(require) {

    let _this = {
        createFrame: function() {
            let result = new Frame();
            return result;
        },

        parseFrame: function(frame) {
            let result = new Frame();

            // YOUR CODE GOES HERE
            let data = JSON.parse(frame);
            for (let i = 0; i < data.objects.length; i++)
                result.addObject(data.objects[i]);

            result.frameNum = data.frameNumber;

            return result;
        },

        lerpFrames: function(frame0, frame1, t) {
            let result = null;//new Frame();

            // YOUR CODE GOES HERE
            result = frame0;

            return result;
        }
    };

    return _this;
});
