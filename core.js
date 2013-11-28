// By Raccoon , undyingmoon
// include namespace

// control screen refresh to 60 FPS (Because screen update is 50Hz ~ 60Hz)
(function () {
    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            callback.requestAnimationFrame = window.setInterval(callback, 16.666);
        };
    window.cancelRequestAnimationFrame = window.cancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        function (callback, element) {
            window.clearInterval(callback.requestAnimationFrame);
            callback.requestAnimationFrame = null;
            delete callback.requestAnimationFrame;
        };
})();

var framework = (function (framework) {
    // log
    framework.log = {};
    framework.log.info = function (str) {
        var newLog = document.createElement("p");
        var log = document.createTextNode("System log : " + str);
        newLog.appendChild(log);
        document.getElementById("log").appendChild(newLog);
    };
    // create namespace from javascript patterns namespace pattern
    framework.namespace = function (ns_string) {
        var parts = ns_string.split("."),
            parent = framework,
            i;
        if (parts[0] === "framework") {
            parts = parts.slice(1);
        }
        for (i = 0; i < parts.length; i += 1) {
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parts;
    };
    // framework.class.create (simulator Inheritance class)
    framework.class = {
        create: function (createObj, options) {
            var emptyObj = function () {
            };
            var newObj = new createObj();
            emptyObj.prototype = createObj.prototype;
            newObj.prototype = new emptyObj;
            newObj.uber = createObj.prototype;
            //讀出所有的屬性，如果不是內建的就加給obj
            for (var option in options) {
                if (options.hasOwnProperty(option)) {
                    newObj[option] = options[option];
                }
            }
            return newObj;
        }
    };
    return framework;
})(framework || {});




