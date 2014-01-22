// By Raccoon

var Framework;
Framework = (function (Framework) {
    Framework.Scene = Framework.Class({
        position: {x:0,y:0},
        rotation: 0,
        scale: 1,
        update: function(){},
        draw: function(){},
        toString:function(){return "[Scene Object]"}
    });
    return Framework;
})(Framework || {});