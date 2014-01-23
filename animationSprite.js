// By Raccoon
// include namespace
var Framework = (function (Framework) {
    Framework.AnimationSprite = Framework.Class(Framework.Scene , {
        __construct: function(options){
            // Define variable
            // private
            this._id = undefined;
            this._type = undefined;
            this._fpsCounter = 0;
            this._isLoadSprite = false;
            this._sprites = [];
            // public
            this.col = 1;
            this.row = 1;
            this.from = 0;
            this.to = 0;
            this.currentIndex = 0;
            this.speed = 10;
            this.loop = true;
            this.maxIndex = 0;

            // 建構子參數判斷
            if(!Framework.Util.isUndefined(options.url)){
                if(Framework.Util.isString(options.url)){
                    this.id = options.url;
                    if(Framework.Util.isUndefined(options.col) || Framework.Util.isUndefined(options.row)){
                        Framework.DebugInfo.Log.error("AnimationSprite Error : 建構子參數錯誤，需指定col、row");
                        throw new SyntaxError("AnimationSprite constructor arguments error");
                    }else{
                        this.col = options.col;
                        this.row = options.row;
                        this.maxIndex = this.col * this.row;
                    }
                }else if(Array.isArray(options.url)){
                    this.maxIndex = options.url.length;
                    this.row = options.url.length;
                }else{
                    Framework.DebugInfo.Log.error("AnimationSprite Error : 建構子參數錯誤，url格式不正確");
                    throw new SyntaxError("AnimationSprite constructor arguments error");
                }
            }else{
                Framework.DebugInfo.Log.error("AnimationSprite Error : 建構子參數錯誤");
                throw new SyntaxError("AnimationSprite constructor arguments error");
            }
            this.speed = options.speed || 24 ;
            this.loop = options.loop || true;


            if(Framework.Util.isString(options.url)){
                //單張圖片切割
                Framework.ResourceManager.loadImage({id:this.id, url:this.id});
                this.type = 'one';
            }else if(Array.isArray(options.url)){
                //一堆圖片串成動畫
                this.id = [];
                this.type = 'more';
                options.url.forEach(function(src){
                    this._sprites.push(new Framework.Sprite(src));
                } , this);
                this._isLoadSprite = true;
            }else if(!Framework.Util.isUndefined(options)){
                Framework.DebugInfo.Log.error("AnimationSprite 不支援的參數 " + options);
            }
        },
        update:function(){
            if((++this._fpsCounter>this.speed)){
                this._fpsCounter = 0;
                this.currentIndex = (this.currentIndex+1) % (this.col * this.row);
                if(this.currentIndex >= this.maxIndex) this.currentIndex = 0 ;
            }
            if(this._isLoadSprite){
                this._sprites[this.currentIndex].position = this.position;
                this._sprites[this.currentIndex].rotation = this.rotation;
                this._sprites[this.currentIndex].scale = this.scale;
            }else{
                if(this.type === 'one'){
                    // 故意用 closures 隔離變數的scope
                    (function(){
                        for(var i=0;i<this.col*this.row;i++){
                            var texture = Framework.ResourceManager.getResource(this.id);
                            var tmp = document.createElement("canvas");
                            var realWidth = texture.width * this.scale;
                            var realHeight = texture.height * this.scale;
                            tmp.width = (realWidth ) / this.col;
                            tmp.height = (realHeight ) /this.row;
                            var tmpContext = tmp.getContext("2d");
                            tmpContext.drawImage(texture,-(texture.width / this.col)*(i%this.col), -(texture.height/this.row) * (Math.floor(i/this.col)) );
                            var sprite = new Framework.Sprite(tmp);
                            sprite.position = this.position;
                            sprite.rotation = this.rotation;
                            sprite.scale = this.scale;
                            this._sprites.push(sprite);
                        }
                    }).call(this);
                    this._isLoadSprite = true;
                }
            }
        },
        draw:function(context){
            if(this._isLoadSprite){
                this._sprites[this.currentIndex].draw(context);
            }
        },
        toString:function(){
            return "[AnimationSprite Object]";
        }
    });
    return Framework;
})(Framework || {});
