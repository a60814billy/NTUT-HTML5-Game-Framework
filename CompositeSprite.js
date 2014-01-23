// By Raccoon
// include namespace
var Framework = (function (Framework) {
    Framework.CompositeSprite = Framework.Class(Framework.Scene, {
        __construct: function(options){
			this.id = undefined;
            this.type = undefined;
            this.texture = undefined;
            this.attachArray=new Array();
        },
        update: function () {
		    var i,target,rad;
		    for (i = 0; i < this.attachArray.length ; i++) {
		        target = this.attachArray[i];
		        rad = (this.rotation / 180) * Math.PI
		        target.rotation = target.selfRotation + this.rotation;
		        target.scale = target.selfScale * this.scale;
		        target.position.x = Math.floor((target.relativePosition.x * Math.cos(rad) - target.relativePosition.y * Math.sin(rad))) * this.scale + this.position.x;
		        target.position.y = Math.floor((target.relativePosition.x * Math.sin(rad) + target.relativePosition.y * Math.cos(rad))) * this.scale + this.position.y;
		        target.update();
		        
		    }
		},
        draw:function(context){
            var i,target;
            for (i = 0; i < this.attachArray.length ; i++) {
                this.attachArray[i].draw(context);
            }
        },
        attach: function (target) {
            if (Framework.Util.isUndefined(target.relativePosition)) {
                target.relativePosition = { x: 0, y: 0 };
            }
            if (Framework.Util.isUndefined(target.selfRotation)) {
                target.selfRotation = 0;
            }
            if (Framework.Util.isUndefined(target.selfScale)) {
                target.selfScale = 1;
            }
		    this.attachArray.push(target);
		},
        toString:function(){
            return "[CompositeSprite Object]";
        }
    });
    return Framework;
})(Framework || {});
