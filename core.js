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

var Framework = (function (Framework) {
    // Extend Date's function , add format method
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        };

        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };

    // Framework.class.create (simulator Inheritance class)
    Framework.inheritance = function (createObj, options) {
        var emptyObj = function () {};
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
    };

    return Framework;
})(Framework || {});




