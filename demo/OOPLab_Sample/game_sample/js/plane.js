var plane = function()
{
	var physicScale = 30;
	Object.defineProperty(this, 'position', {
        get: function() {
            return this.mPosition;
        },

        set: function(newValue) {
            this.mPosition = newValue;
            this.planeBody.SetPosition(new this.mBox2D.b2Vec2(newValue.x / physicScale,newValue.y / physicScale));
            this.planePic.position = {x: newValue.x, y: newValue.y};
        },
    });

	this.mPosition;
	this.planePic = null;
	this.planeBody = null;
	this.mBox2D;
    this.init = function(box2D)
    {
    	this.planePic = new Framework.Sprite(define.imagePath + '173.bmp');
    	
		this.planeBody = box2D.createSquareBody(1, 1, box2D.bodyType_Dynamic);
    	this.mBox2D = box2D;
	};

	this.update = function()
	{
		if(!this.bodyCreated && this.secondUpdate) {
			this.bodyCreated = true;
			console.log("width ",this.planePic.width, " height",this.planePic.height);
			this.planeBody.GetFixtureList().GetShape().SetAsBox(this.planePic.width / physicScale, this.planePic.height / physicScale);
		}
		this.secondUpdate = true;
		this.planePic.position = {x:this.planeBody.GetPosition().x * physicScale ,y:this.planeBody.GetPosition().y * physicScale};

	}


}