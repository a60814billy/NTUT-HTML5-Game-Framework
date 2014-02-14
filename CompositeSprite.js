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
            this.CountAbsoluteProperty();
		    var i;
		    for (i = 0; i < this.attachArray.length ; i++) {

		        this.attachArray[i].CountAbsoluteProperty();
		        this.attachArray[i].update();
		    }
		},
        draw:function(context){
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
        toString:function(){
            return "[CompositeSprite Object]";
        }
    });
    return Framework;
})(Framework || {});
