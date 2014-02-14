// By Raccoon
// include namespace
var Framework = (function (Framework) {
    Framework.AnimationSprite = Framework.Class(Framework.Scene , {
        __construct: function(options){
            // Define variable
            // private
            this._id = undefined;
            this._type = undefined;
            this._isLoadSprite = false;
            this._sprites = [];
            this._previousTime = (new Date()).getTime();
            this._start = false;
            // public
            this.col = 1;
            this.row = 1;
            this.from = 0;
            this.to = -1;
            this.index = 0;
            this.speed = 10;
            this.loop = true;
            this.maxIndex = 0;

            // 建構子參數判斷
            if(!Framework.Util.isUndefined(options.url)){
                if(Framework.Util.isString(options.url)){
                    this._id = options.url;
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
            this.loop = (Framework.Util.isUndefined(options.loop) ? true : options.loop);


            if(Framework.Util.isString(options.url)){
                //單張圖片切割
                Framework.ResourceManager.loadImage({id:this._id, url:this._id});
                this._type = 'one';
            }else if(Array.isArray(options.url)){
                //一堆圖片串成動畫
                this._id = [];
                this._type = 'more';
                options.url.forEach(function(src){
                    this._sprites.push(new Framework.Sprite(src));
                } , this);
                this._isLoadSprite = true;
            }else if(!Framework.Util.isUndefined(options)){
                Framework.DebugInfo.Log.error("AnimationSprite 不支援的參數 " + options);
            }
        },
        _nextFrame: function(){
            if(this._start){
                this.index ++;
                if(this.to === -1){
                    if(this.index >= this.maxIndex){
                        this._start = this.loop;
                        if(this._start){
                            this.index = this.from;
                        }else{
                            this.index = this.maxIndex-1;
                        }
                    }
                }else{
                    if(this.index > this.to){
                        this._start = this.loop;
                        this.index = this.from;
                    }
                }
            }
        },
        start:function(from , to , speed , loop){
            this.from = (Framework.Util.isUndefined(from) ? this.from : from);
            this.to = (Framework.Util.isUndefined(to) ? this.to : to);
            this.speed = (Framework.Util.isUndefined(speed) ? this.speed : speed);
            this.loop = (Framework.Util.isUndefined(loop) ? this.loop : loop);
            this.index = this.from;
            this._start = true;
            this._previousTime = (new Date()).getTime();
        },
        update:function(){
            var now = (new Date()).getTime();
            if( (now - this._previousTime) > (1000 / this.speed) ){
                for(var i= 1,l=Math.floor((now - this._previousTime)/(1000 / this.speed));i<=l;i++){
                    this._nextFrame();
                }
                this._previousTime = now;
            }
            if (this._isLoadSprite) {
                this.texture = this._sprites[this.index];
                this._sprites[this.index].position = this.position;
                this._sprites[this.index].rotation = this.rotation;
                this._sprites[this.index].scale = this.scale;
                this._sprites[this.index].CountAbsoluteProperty();
                
            }else{
                if(this._type === 'one'){
                    // 故意用 closures 隔離變數的scope
                    (function(){
                        this.texture = Framework.ResourceManager.getResource(this._id);
                        for(var i=0;i<this.col*this.row;i++){

                            var tmp = document.createElement("canvas");
                            var realWidth = this.texture.width * this.scale;
                            var realHeight = this.texture.height * this.scale;
                            tmp.width = (this.texture.width ) / this.col;
                            tmp.height = (this.texture.height ) /this.row;
                            var tmpContext = tmp.getContext("2d");
                            tmpContext.drawImage(this.texture,-(this.texture.width / this.col)*(i%this.col), -(this.texture.height/this.row) * (Math.floor(i/this.col)) );
                            var sprite = new Framework.Sprite(tmp);
                            sprite.position = this.position;
                            sprite.rotation = this.rotation;
                            sprite.scale = this.scale;
                            sprite.spriteParent = this.spriteParent;
                            this._sprites.push(sprite);
                        }
                        if (this.from > this.to) {
                            var indexFrom = this.from, indexTo = this.to;
                            while (indexFrom > indexTo) {
                                var a = this._sprites[indexFrom], b = this._sprites[indexTo]
                                b = [a, a = b][0];
                                indexFrom--;
                                indexTo++;
                            }
                            this.from = [this.to, this.to = this.from][0];
                        }

                    }).call(this);
                    this._isLoadSprite = true;
                }
            }
        },
        draw:function(context){
            if(this._isLoadSprite){
                this._sprites[this.index].draw(context);
            }
        },
        toString:function(){
            return "[AnimationSprite Object]";
        },
        teardown:function(){
            if(this.type === 'one'){
                Framework.ResourceManager.destroyResource(this.id);
            }else if(this.type === 'more'){
                this._sprites.forEach(function(s){
                    s.teardown();
                },this)
            }
        }
    });
    return Framework;
})(Framework || {});
