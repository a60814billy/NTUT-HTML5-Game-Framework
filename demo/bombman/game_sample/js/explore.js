
var Explore = function() {
    this.sprite = new Framework.AnimationSprite({url:define.imagePath + 'explore.png', col:3 , row:1 , loop:true , speed:12}); 
    this.sprite.scale = 2;
    this.sprite.initialize();
    this.sprite.start({ from: 0, to: 2, loop: true })
    var PIXEL_CONST = 64;

    this.mapPosition = {x:0, y:0};

    this.constants = new Constants();

    this.ExploredEndCallBack = [];

    this.exploreCounter = 0;
    this.exploreTime = 5;

    this.update = function(){
        this.sprite.update();
        if(this.exploreCounter > this.exploreTime){
            //callback
            for(var i=0; i<this.ExploredEndCallBack.length; i++){
                this.ExploredEndCallBack[i](this);
            }
        }
        this.exploreCounter++;


    }

    this.draw = function(ctx){
        this.sprite.position = {x: this.mapPosition.x * PIXEL_CONST, y: this.mapPosition.y * PIXEL_CONST};
        this.sprite.draw(ctx);
    }


};

Object.defineProperty(Explore.prototype, 'position', {
    get: function() {
        return this.mapPosition;
    },
    set: function(newValue) {
        this.mapPosition = newValue;
    }
}); 
