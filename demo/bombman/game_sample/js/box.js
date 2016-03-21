
var Box = function(item) {
    this.sprite = new Framework.Sprite(define.imagePath + 'box.png'); 
    this.sprite.scale = 2;
    this.sprite.index = 1;
    var PIXEL_CONST = 64;

    this.mapPosition = {x:0, y:0};

    this.constants = new Constants();
    this.item = item;

    //被炸彈炸到的function
    this.explored = function(){

    }

    this.update = function(){

    }


    this.draw = function(ctx){
        this.sprite.position = {x: this.mapPosition.x * PIXEL_CONST, y: this.mapPosition.y * PIXEL_CONST};
        this.sprite.draw(ctx);
    }

};

Object.defineProperty(Box.prototype, 'position', {
    get: function() {
        return this.mapPosition;
    },
    set: function(newValue) {
        this.mapPosition = newValue;
    }
}); 
