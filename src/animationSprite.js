// By Raccoon
// include namespace
var Framework = (function (Framework) {    
    'use strict'
    Framework.AnimationSprite = Framework.exClass(Framework.GameObject , {
        /**
        * 支援播放連續圖片的Sprite
        *
        * @class AnimationSprite
        * @constructor 
        * @extends GameObject
        * @param  {Object} options 
        * options.url為要載入的圖片, 當url為一個Array時表示為零散的多張圖片, 
        * 當為string時表示是一張大張的連續動作圖, 
        * 故需要在提供大張連續圖的row和col. 
        * options.speed可以設定這個Sprite播放的速度(fps), 
        * options.loop 則可以設定這個Sprite是否需要不斷重複播放
        * @example
        *     new Framework.AnimationSprite({url:['image1.png', 'image2.bmp']}); //多張圖片
        *     new Framework.AnimationSprite({url:' bigImage.png', col: 10 , row: 7 , loop: true , speed: 6}); //只有一張大型的連續動作圖,speed和loop為非必要項
        * 
        */
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
            this.to = 0;
            this.index = 0;
            this.speed = 10;
            this.loop = true;
            this.maxIndex = 0;
            this.finishPlaying = function(){};

            // 建構子參數判斷
            if(!Framework.Util.isUndefined(options.url)){
                if(Framework.Util.isString(options.url)){
                    this._id = options.url;
                    if(Framework.Util.isUndefined(options.col) || Framework.Util.isUndefined(options.row)){
                        Framework.DebugInfo.Log.error('AnimationSprite Error : 建構子參數錯誤，需指定col、row');
                        throw new SyntaxError('AnimationSprite constructor arguments error');
                    }else{
                        this.col = options.col;
                        this.row = options.row;
                        this.maxIndex = this.col * this.row - 1;
                    }
                }else if(Array.isArray(options.url)){
                    this.maxIndex = options.url.length - 1;
                    this.row = options.url.length;
                }else{
                    Framework.DebugInfo.Log.error('AnimationSprite Error : 建構子參數錯誤，url格式不正確');
                    throw new SyntaxError('AnimationSprite constructor arguments error');
                }
            }else{
                Framework.DebugInfo.Log.error('AnimationSprite Error : 建構子參數錯誤');
                throw new SyntaxError('AnimationSprite constructor arguments error');
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
                Framework.DebugInfo.Log.error('AnimationSprite 不支援的參數 ' + options);
            }
        },
        _nextFrame: function(){
            if(this._start){
                this.index++;
                if(this.index > this.to) {
                    if(this.loop) {
                        this.index = this.from;
                    } else {
                        this.index = this.to
                        this._start = false;
                        this.finishPlaying.call(this);
                    }
                }
                /*if(this.to === -1){
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
                }*/
            }
        },


        /**
        * 
        * 開始播放設定好的AnimationSprite
        * @method start
        * @param {Object} options options.from和options.to表示要從第幾張播放到第幾張, 
        * 若to < from表示要倒著播放, 可以在此設定要被播放的速度和是否重複播放,
        * finishPlaying可以設定播放完畢後是否要有callback
        * (loop: true時, 此callback永遠不會被執行)
        * @example 
        *     start({from:3, to: 5}); //從第三張圖片播放到第五張
        *     start({from:6, to: 1}); //倒著從第六張圖片播放到第一張
        *     start({from:6, to: 1, loop: false, speed: 1, finishPlaying: function(){
        *         console.log('finish');
        *     }});
        */
        start:function(option){
            var option = option || {};            
            this.from = (Framework.Util.isUndefined(option.from) ? 0 : option.from);
            this.to = (Framework.Util.isUndefined(option.to) ? this.maxIndex : option.to);
            this.speed = (Framework.Util.isUndefined(option.speed) ? this.speed : option.speed);
            this.loop = (Framework.Util.isUndefined(option.loop) ? this.loop : option.loop);
            
            this._start = true;
            this._previousTime = (new Date()).getTime();
            this.finishPlaying = option.finishPlaying || function() {};
            this.userInputFrom = this.from;
            this.userInputTo = this.to;
            if (this.userInputFrom > this.userInputTo) {
                this.from = this.maxIndex - this.from;
                this.to = this.maxIndex - this.to;
                if (this._type === 'more') {
                    this._sprites.reverse();
                }
            }
            this.index = this.from;
        },

        /**
        * 停止播放AnimationSprite, 若已經停止, 則不會發生任何事情
        * @method stop       
        */
        stop: function() {
            this._start = false;
        },

        /**
        * 繼續播放AnimationSprite, 若未曾停止, 則不會發生任何事情
        * @method resume       
        */
        resume: function() {
            if(!this._start) {
                this._previousTime = (new Date()).getTime();
                this._start = true;
            }            
        },
        update: function(){  
            var now = (new Date()).getTime();
            if((now - this._previousTime) > (1000 / this.speed)){
                for (var i = 1, l = Math.floor((now - this._previousTime)/(1000 / this.speed)); i <= l; i++) {
                    if(this._start) {
                        this._nextFrame();
                    }
                }
                this._previousTime = now;
            }
            if (this._isLoadSprite) {                
                if(this._type === 'more') {
                    //為了要確保圖片大小是對的(如果是連續圖則必須使用原本的圖形, 非切割過後的)
                    this.texture = this._sprites[this.index];
                } 
                
                this._sprites[this.index].spriteParent = this.spriteParent;
                this._sprites[this.index].position = this.position;
                this._sprites[this.index].rotation = this.rotation;
                this._sprites[this.index].scale = this.scale;
                this._sprites[this.index].layer = this.layer;
                this._sprites[this.index].isDrawBoundry = this.isDrawBoundry;
                this._sprites[this.index].isDrawPace = this.isDrawPace;
                
            } else {
                if(this._type === 'one'){
                    // 故意用 closures 隔離變數的scope
                    (function() {
                        this.texture = Framework.ResourceManager.getResource(this._id);
                        for (var i = 0; i < this.col * this.row; i++){

                            var tmp = document.createElement('canvas');
                            var realWidth = this.texture.width * this.scale;
                            var realHeight = this.texture.height * this.scale;
                            tmp.width = (this.texture.width ) / this.col;
                            tmp.height = (this.texture.height ) /this.row;
                            var tmpContext = tmp.getContext('2d');
                            tmpContext.drawImage(this.texture,-(this.texture.width / this.col)*(i%this.col), -(this.texture.height/this.row) * (Math.floor(i/this.col)) );
                            var sprite = new Framework.Sprite(tmp);
                            sprite.position = this.position;
                            sprite.rotation = this.rotation;
                            sprite.scale = this.scale;
                            sprite.spriteParent = this.spriteParent;
                            this._sprites.push(sprite);
                        }
                        if (this.userInputFrom > this.userInputTo) {
                            this._sprites.reverse();
                            /*var indexFrom = this.maxIndex, indexTo = 0;
                            while (indexFrom > indexTo) {
                                this._sprites[indexFrom] = [this._sprites[indexTo], this._sprites[indexTo] = this._sprites[indexFrom]][0];
                                
                                indexFrom--;
                                indexTo++;
                            }*/
                        }

                    }).call(this);
                    this._isLoadSprite = true;
                }
            }
        },
        draw:function(context){
            context = context || Framework.Game._context;
            this.countAbsoluteProperty();
            if(this._isLoadSprite){
                this._sprites[this.index].draw(context);
            }
        },
        toString:function(){
            return '[AnimationSprite Object]';
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
