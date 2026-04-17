var Dispatcher = /** @class */ (function () {
    function Dispatcher() {
        this.events = {};
    }
    Dispatcher.prototype.on = function (name, callback) {
        var callbacks = this.events[name] || [];
        callbacks.push(callback);
        this.events[name] = callbacks;
    };
    Dispatcher.prototype.emit = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var callbacks = this.events[name];
        if (callbacks) {
            callbacks.forEach(function (callback) { return callback.apply(void 0, args); });
        }
        else {
            throw new Error("Event ".concat(name, " does not exist."));
        }
    };
    Dispatcher.prototype.once = function (name, callback) {
        var _this = this;
        var onceCallback = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            callback.apply(void 0, args);
            _this.off(name, onceCallback);
        };
        this.on(name, onceCallback);
    };
    Dispatcher.prototype.off = function (name, callback) {
        var callbacks = this.events[name];
        if (callbacks && callback) {
            this.events[name] = callbacks.filter(function (cb) { return cb !== callback; });
        }
    };
    return Dispatcher;
}());
var i = new Dispatcher();
i.on('test', function (msg) {
    console.log("Received message: ".concat(msg));
});
i.emit('test', 'Hello, World!');
i.once('testOnce', function (msg) {
    console.log("Received message: ".concat(msg));
});
i.emit('testOnce', 'Hello, Once!');
i.emit('testOnce', 'Hello, Once Again!'); 
i.off('test', function (msg) {
    console.log("Received message: ".concat(msg));
});
i.emit('test', 'Hello, World!'); 
