// By Raccoon
// include namespace
var Framework = (function (Framework) {
    Framework.Sprite = Framework.Class(Framework.Scene , {
        __construct: function(options){
            this.id = undefined;
            this.type = undefined;
            this.texture = undefined;
            if(Framework.Util.isString(options)){
                this.id = options;
                Framework.ResourceManager.loadImage({id:options, url:options});
                this.type = 'image';
            }else if(Framework.Util.isCanvas(options)){
                this.texture = options;
                this.type = "canvas";
            }else if(!Framework.Util.isUndefined(options)){
                Framework.DebugInfo.Log.error("Sprite 不支援的參數 " + options);
            }
        },
        draw:function(context){
            var texture , tmp , realWidth , realHeight , tmpContext;
            if(Framework.Util.isUndefined(this.texture)){
                this.texture = Framework.ResourceManager.getResource(this.id);
            }
            if(this.type === 'image' || this.type === 'canvas'){
                tmp = document.createElement("canvas");
                // 計算縮放後的大小
                realWidth = this.texture.width * this.scale;
                realHeight = this.texture.height * this.scale;
                // 將canvas 放大才不會被切到
                tmp.width = realWidth * 2;
                tmp.height = realHeight * 2;
                tmpContext = tmp.getContext("2d");
                // 將Canvas 中心點移動到左上角(0,0)
                tmpContext.translate(tmp.width/2 , tmp.height/2);
                // 旋轉Canvas
                tmpContext.rotate(this.rotation / 180 * Math.PI);
                // 移回來
                tmpContext.translate(-tmp.width/2 , -tmp.height/2);
                // 縮放
                tmpContext.scale(this.scale, this.scale);
                // 畫圖
                tmpContext.drawImage(this.texture, this.texture.width /2, this.texture.height/2);
                // 再畫到主Canvas上
                context.drawImage(tmpContext.canvas, this.position.x - this.texture.width*this.scale, this.position.y - this.texture.height*this.scale);
            }
        },
        toString:function(){
            return "[Sprite Object]";
        },
        teardown:function(){
            if(this.type === 'image'){
                Framework.ResourceManager.destroyResource(this.id);
            }
        }
    });
    return Framework;
})(Framework || {});
