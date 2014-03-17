var MyBox2D = Framework.Class(Framework.Level , {  
    initialize: function() {


        this.box2D = new Framework.Box2D();
        this.box2D.createWorld();
        this.box2D.initDebugDraw();

        //bodyFactory.createWorld({gravityX: 0, gravityY: 10, allowSleep:true});
        var ground = this.box2D.createSquareBody(10, 0.5, this.box2D.bodyType_Static);
        ground.SetPosition(new this.box2D.b2Vec2(10,19));

        this.plane = new plane();
        this.plane.init(this.box2D);
        this.plane.position = {x: 100, y: 100};


        this.goLeftPlane = new Framework.Sprite(define.imagePath + '173.bmp');
        this.goRightPlane = new Framework.Sprite(define.imagePath + '169.bmp');
        
        this.goLeftPlane.position = {
            x: window.innerWidth / 4 * 3,
            y: window.innerHeight / 2
        };

        this.goRightPlane.position = {
            x: window.innerWidth / 4,
            y: window.innerHeight / 2
        };

        this.rootScene.attach(this.plane.planePic);
    },

    update:function(){         
        this.plane.update();
    },

    draw: function(parentCtx) {   
        this.box2D.draw();
        this.rootScene.draw();  
    },

    keydown: function(e, list){        
        if(e.key === 'Right') {
            this.goRightPlane.position.x += 5;
        }

        if(e.key === 'Left') {
            this.goLeftPlane.position.x -= 5;
        }
    },
});