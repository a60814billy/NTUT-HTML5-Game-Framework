// By Raccoon

var Framework;
Framework = (function (Framework) {
    Framework.Scene = Framework.Class({
        __construct:function(){
            this.position = {x:0,y:0};
            this.rotation = 0;
            this.scale = 1;
        },
        update: function(){},
        draw: function(){},
        toString:function(){return "[Scene Object]"}
    });
    return Framework;
})(Framework || {});