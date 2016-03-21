
var IncreaseBombNum = function() {
    this.url = file;       
    this.sprite = new Framework.Sprite(define.imagePath + 'increaseBombNum.png'); 
    this.sprite.scale = 2;
    this.sprite.index = 1;
    var PIXEL_CONST = 64;

    this.mapPosition = {x:0, y:0};
    

    this.eaten = function(){

    }

    //被炸彈炸到的function
    this.explored = function(){

    }

    this.update = function()

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
