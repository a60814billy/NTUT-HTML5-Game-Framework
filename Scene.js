// By Raccoon
// include namespace
var Framework = (function (Framework) {
    Framework.Scene = Framework.Class(Framework.GameObject, {
        __construct: function(options){
			this.id = undefined;
            this.type = undefined;
            this.texture = undefined;
            this.attachArray=[];
            /*this.position = {
                x: Framework.Game._canvas.width / 2,
                y: Framework.Game._canvas.height / 2
            }*/
        },
        update: function () {
            //this.CountAbsoluteProperty();
		    var i;
		    for (i = 0; i < this.attachArray.length ; i++) {

		        //this.attachArray[i].CountAbsoluteProperty();
		        this.attachArray[i].update();
		    }
		},
        draw:function(context){
            this.countAbsoluteProperty();
            var i,target;           
            for (i = 0; i < this.attachArray.length ; i++) {
                this.attachArray[i].draw(context);
                
            }
        },
        attach: function (target) {
            //if (Framework.Util.isUndefined(target.relativePosition)) {
            //    target.relativePosition = target.position || { x: 0, y: 0 };
            //}
            //if (Framework.Util.isUndefined(target.selfRotation)) {
            //    target.selfRotation = target.rotation || 0;
            //}
            //if (Framework.Util.isUndefined(target.selfScale)) {
            //    target.selfScale = target.scale || 1;
            //}
		    this.attachArray.push(target);
            target.spriteParent = this;
		},
        detach: function (target) {   
            var index = -1, i;
            for(i = 0; i < this.attachArray.length; i++) {
                if(this.attachArray[i] === target) {
                    index = i;
                    break;
                }
            }
            if(index > -1) {
                this.attachArray.splice(index, 1);
                target.spriteParent = {};
            }
        },
        toString:function(){
            return "[Scene Object]";
        }
    });
    return Framework;
})(Framework || {});
