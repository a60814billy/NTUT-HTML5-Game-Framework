// By Raccoon
// include namespace

var Framework = (function (Framework) {

    Framework.Level = Framework.Class({
        __construct: function () {
            this.rootScene = new Framework.Scene();
            this.autoDelete = true;
        },
        initializeProgressResource: function () {
        },
        loadingProgress: function (context) {
            context.font = "90px Arial";
            context.fillText(Framework.ResourceManager.getFinishedRequestPercent() + "%" , context.canvas.width/2 - 50 , context.canvas.height/2);
        },
        initialize: function () {
        },
        update: function () {
        },
        draw: function () {
        },
        click: function (e) {
        },
        mousedown: function (e) {
        },
        mouseup: function (e) {
        },
        mousemove: function (e) {
        },
        touchstart: function (e) {
        },
        touchend: function (e) {
        },
        touchmove: function (e) {
        },
        keydown: function (e) {
        },
        keyup: function (e) {
        },
        keypress: function (e) {
        },
        teardown:function(){},
        autodelete : function(){
            for(var i in this.rootScene.attachArray){
                this.rootScene.attachArray[i].teardown();
                this.rootScene.attachArray[i] = null;
                delete this.rootScene.attachArray[i];
            }
            this.teardown();
        }
    });

    return Framework;
})(Framework || {});