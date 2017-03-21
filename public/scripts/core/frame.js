define(function(require) {
    let _objects = [ ];
    let _index = { };

    let _this = {
        addObject: function(obj) {
            if (!obj || !obj.id)
                return null

            let index = _objects.length;
            if (_index.hasOwnProperty(obj.id))
                index = _index[obj.id];
            else
                _index[obj.id] = index;

            _objects[index] = obj;

            return obj;
        },

        getObject: function(id) {
            if (_index.hasOwnProperty(id))
                return _objects[_index[id]];
            else
                return null;
        },

        getAllObjects: function() {
            return _objects;
        }
    };

    return _this;
});
