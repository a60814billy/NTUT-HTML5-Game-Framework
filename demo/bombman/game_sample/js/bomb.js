
var Bomb = function(power) {
    this.sprite = new Framework.AnimationSprite({url:define.imagePath + 'bomb.png', col:2 , row:1 , loop:true , speed:6}); 
    this.sprite.scale = 2;
    this.sprite.initialize();
    this.sprite.start({ from: 0, to: 1, loop: true })
    var PIXEL_CONST = 64;

    this.ExploredCallBack = [];

    this.mapPosition = {x:0, y:0};
    this.bombExploreNum = 50;
    this.bombExploreCounter = 0;

    this.bombPower = power;


    this.explore = function(){
        var bombArray = [[],[],[],[]]
        bombArray[0].push(this.mapPosition);
        for(var i=1; i<=this.bombPower; i++){
            bombArray[0].push({x:this.mapPosition.x + i,y:this.mapPosition.y});
            bombArray[1].push({x:this.mapPosition.x,y:this.mapPosition.y + i});
            bombArray[2].push({x:this.mapPosition.x - i,y:this.mapPosition.y});
            bombArray[3].push({x:this.mapPosition.x,y:this.mapPosition.y - i});
        }

        //callback
        for(var i=0; i<this.ExploredCallBack.length; i++){
            this.ExploredCallBack[i](bombArray,this);
        }
    }

    this.update = function(){
        if(this.bombExploreCounter > this.bombExploreNum){
            this.explore();
        }
        this.bombExploreCounter++;
        this.sprite.update();

    }

    this.constants = new Constants();


    this.draw = function(ctx){
        this.sprite.position = {x: this.mapPosition.x * PIXEL_CONST, y: this.mapPosition.y * PIXEL_CONST};
        this.sprite.draw(ctx);
    }

};

Object.defineProperty(Bomb.prototype, 'position', {
    get: function() {
        return this.mapPosition;
    },
    set: function(newValue) {
        this.mapPosition = newValue;
    }
}); 
