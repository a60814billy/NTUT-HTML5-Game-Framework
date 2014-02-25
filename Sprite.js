// By Raccoon
// include namespace
var Framework = (function (Framework) {
    Framework.Sprite = Framework.Class(Framework.GameObject , {
        /**
        * 可以用來繪製圖片的物件
        *
        * @class Sprite
        * @constructor 
        * @extends GameObject
        * @param  {string} filePath 圖片路徑
        * @example
        *     new Framework.Sprite('clock.png');
        * 
        */
        __construct: function(options){
            this.id = undefined;
            this.type = undefined;
            this.texture = undefined;
            this.isDrawBoundry = false;
            this.isDrawPace = false;
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
            this.countAbsoluteProperty();
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
                var diagonalLength = Math.ceil(Math.sqrt(Math.pow(realHeight, 2) + Math.pow(realWidth, 2)));
                tmp.width = diagonalLength;
                tmp.height = diagonalLength;

                var widthRatio = tmp.width / realWidth,
                    heightRatio = tmp.height / realHeight,
                    tranlateX = tmp.width / 2,
                    tranlateY = tmp.height / 2;
                
                tmpContext = tmp.getContext("2d");
                // 將Canvas 中心點移動到左上角(0,0)
                tmpContext.translate(tranlateX , tranlateY);
                // 旋轉Canvas
                tmpContext.rotate(this.absoluteRotation / 180 * Math.PI);
                // 移回來
                tmpContext.translate(-tranlateX , -tranlateY);
                // 縮放
                tmpContext.scale(this.absoluteScale, this.absoluteScale);
                // 畫圖
                // 
                // 
                
                tmpContext.drawImage(this.texture, (tmp.width - realWidth) / 2 / this.absoluteScale, (tmp.height - realHeight) / 2 / this.absoluteScale);

                // 再畫到主Canvas上
                
                if(this.isDrawBoundry) {
                    tmpContext.rect((tmp.width - realWidth) / 2 / this.absoluteScale, (tmp.height - realHeight) / 2 / this.absoluteScale, this.texture.width, this.texture.height);                    
                } 

                if(this.isDrawPace) {
                    context.rect(this.absolutePosition.x, this.absolutePosition.y, 1, 1);
                } 

                tmpContext.stroke();
                
                
                context.drawImage(tmpContext.canvas, this.absolutePosition.x - tmp.width / 2, this.absolutePosition.y - tmp.height / 2);
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
