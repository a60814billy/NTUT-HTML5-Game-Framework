//由於JS尚未支援Class(ECMAScript 6以後, 宣稱會支援)
//目前Class寫法都是以function的方式
//只要是this.XXX皆會是Public的property
var BombMan = function(file, options) {
    this.url = file;      
    //AnimationSprite當圖片是一整張圖片(連續圖), 而非Array時一定要給col, row三個(url是一定要的)   
    this.sprite = new Framework.AnimationSprite({url:this.url, col:3 , row:4 , loop:true , speed:12}); 
    this.sprite.scale = 2;
    this.sprite.index = 1;
    var PIXEL_CONST = 64;
    //this.sprite.start({ from: 0, to: 2, loop: true});
    this.mapPosition = {x:0, y:0};
    this.spritePosition = {x:0, y:0};
    this.constants = new Constants();

    this.StepMovedCallBack = [];
    this.maxBombNum = 1;
    this.bombNum = 0;
    this.bombPower = 1;

    this.isWalking = false;

    var m_bombMan = this;

    this.playerDirection = this.constants.DirectionEnum.DOWN;
    //以下這句話的意思是當options.position為undefined時this.sprite.position = x: 0, y: 0}
    //若options.position有值, 則this.sprite.position = options.position
    //原因是在JS中, undefined會被cast成false
    //this.sprite.position = options.position || {x: 0, y: 0};
    //this.sprite.scale = options.scale || 1;

    //由於0會被cast成false, 故不能用上面的方法來簡化
    //this.sprite.rotation = (Framework.Util.isUndefined(options.rotation))?0:options.rotation;


    //moveStep為位移量  格式範例{x:1,y:0}
    this.walk = function(moveStep){
        //console.log("player walk " + this.spritePosition.x + ", " + this.spritePosition.y);
        if(this.isWalking === false){
            if(moveStep.x > 0){
                this.playerDirection = this.constants.DirectionEnum.RIGHT;
            }else if(moveStep.x <0){
                this.playerDirection = this.constants.DirectionEnum.LEFT;
            }

            if(moveStep.y > 0){
                this.playerDirection = this.constants.DirectionEnum.DOWN;
            }else if(moveStep.y < 0){
                this.playerDirection = this.constants.DirectionEnum.UP;
            }
            this.isWalking = true;
            this.mapPosition = {x:this.mapPosition.x + moveStep.x, y:this.mapPosition.y + moveStep.y};
            this.sprite.start({ from: this.playerDirection * 3, to: this.playerDirection * 3 + 2, loop: true});
        }
    }

    this.die = function(){
        console.log('player die');
        Framework.Game.goToNextLevel();
    }

    this.walkEnd = function(){    }

    var walkSpeed = 8;
    this.walkAlittle = function(){
        //console.log("player walk a little " + walkSpeed);
        if(this.playerDirection === this.constants.DirectionEnum.DOWN){
            this.spritePosition = {x:this.spritePosition.x, y:this.spritePosition.y + walkSpeed};
        }
        else if(this.playerDirection === this.constants.DirectionEnum.LEFT){
            this.spritePosition = {x:this.spritePosition.x - walkSpeed, y:this.spritePosition.y};
        }
        else if(this.playerDirection === this.constants.DirectionEnum.RIGHT){
            this.spritePosition = {x:this.spritePosition.x + walkSpeed, y:this.spritePosition.y};
        }
        else if(this.playerDirection === this.constants.DirectionEnum.UP){
            this.spritePosition = {x:this.spritePosition.x, y:this.spritePosition.y - walkSpeed};
        }
    }

    this.update = function(){
        this.sprite.update();
        if(this.isWalking){
            if(this.mapPosition.x * PIXEL_CONST === this.spritePosition.x && this.mapPosition.y * PIXEL_CONST === this.spritePosition.y){
                this.isWalking = false;
                this.sprite.stop();
                this.sprite.index = this.playerDirection * 3 + 1;

                //callback
                for(var i=0; i<this.StepMovedCallBack.length; i++){
                    this.StepMovedCallBack[i](this);
                }
            }else{
                this.walkAlittle();
            }
        }
    }


    this.draw = function(ctx){
        this.sprite.position = {x: this.spritePosition.x, y: this.spritePosition.y};
        this.sprite.draw(ctx);
    }

    this.increaseBombNum = function(){
        this.maxBombNum += 1;
    }

    this.increaseBombPower = function(){
        this.bombPower += 1;
    }

    this.bombExploredHandler = function(exploredArray, bomb){
        m_bombMan.bombNum -= 1;
    }

    this.placeBomb = function(){
        if(this.bombNum < this.maxBombNum){
            var bomb = new Bomb(this.bombPower);
            bomb.position = this.mapPosition;
            bomb.ExploredCallBack.push(this.bombExploredHandler);
            this.bombNum += 1;
            return bomb;
        }
        return null;
    }

};

Object.defineProperty(BombMan.prototype, 'position', {
    get: function() {
        return this.mapPosition;
    },
    set: function(newValue) {
        this.mapPosition = newValue;
        this.spritePosition = {x:this.mapPosition.x * 64, y: this.mapPosition.y * 64};
    }
}); 
