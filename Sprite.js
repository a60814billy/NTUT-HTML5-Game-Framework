// By Raccoon
// include namespace
var Framework = (function (Framework) {
    Framework.Sprite = Framework.Class(Framework.Scene , {
        type: null,
        id:null,
        __construct: function(options){
            if(Framework.Util.isString(options)){
                this.id = options;
                Framework.ResourceManager.loadImage({id:options, url:options});
                this.type = 'image';
            }else if(!Framework.Util.isUndefined(options)){
                Framework.DebugInfo.Log.error("Sprite 不支援的參數 " + options);
            }
        },
        draw:function(context){
            var texture = Framework.ResourceManager.getResource(this.id);
            if(this.type === 'image'){
                var tmp = document.createElement("canvas");
                tmp.width = texture.width;
                tmp.height = texture.height;
                var tmpContext = tmp.getContext("2d");
                tmpContext.scale(this.scale, this.scale);
                tmpContext.rotate(this.rotation);
                tmpContext.drawImage(texture, 0, 0);
                context.drawImage(tmpContext.canvas, this.position.x, this.position.y);
            }
        },
        toString:function(){
            return "[Sprite Object]";
        }
    });
    return Framework;
})(Framework || {});
