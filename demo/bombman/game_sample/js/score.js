
var Score = function() {

    this._score = 0;
    this._position = {x:0,y:0};
    this.load = function()
    {
    }

    this.update = function(){
    }


    this.draw = function(ctx){
        ctx.globalAlpha=0.8;
        ctx.fillStyle = 'black'; 
        ctx.fillRect(this._position.x - 10, this._position.y, 300, 40);  
        ctx.font = '30pt Algerian';
        ctx.globalAlpha=1;
        ctx.fillStyle = 'yellow';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText("Score: " + this._score, this._position.x, this._position.y);
    }

    this.addScore = function(score)
    {
        this._score += score;
    }

    this.resetScore = function()
    {
        this._score = 0;
    }
};

Object.defineProperty(Score.prototype, 'position', {
    get: function() {
        return this._position;
    },
    set: function(newValue) {
        this._position = newValue;
    }
}); 
