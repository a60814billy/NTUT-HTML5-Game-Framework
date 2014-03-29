var Framework;
Framework = (function (Framework) {	
	'use strict'
	Framework.Box2D = function() {
		var   b2Vec2 = Box2D.Common.Math.b2Vec2
            ,  b2BodyDef = Box2D.Dynamics.b2BodyDef
            ,  b2Body = Box2D.Dynamics.b2Body
            ,  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            ,  b2Fixture = Box2D.Dynamics.b2Fixture
            ,  b2World = Box2D.Dynamics.b2World
            ,  b2MassData = Box2D.Collision.Shapes.b2MassData
            ,  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            ,  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            ,  b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ;

        var debugFlag = true;

		this.bodyType_Dynamic = Box2D.Dynamics.b2Body.b2_dynamicBody;
		this.bodyType_Static = Box2D.Dynamics.b2Body.b2_staticBody;
		this.b2Vec2 = b2Vec2;

		var options = { density: 1, friction: 0.5 };
		this.world = null;

		this.createWorld = function(options) {
			if(this.world instanceof b2World) {
				return;
			}

			options = options || {};
			options.gravityY = options.gravityY || 10;
			options.gravityX = options.gravityX || 0;
			
			if(typeof options.allowSleep === 'undefined') {
				options.allowSleep = true;
			}

			this.world = new b2World(new b2Vec2(options.gravityX, options.gravityY), options.allowSleep);

			return this.world;
		}

		//var squareBody= Framework.BodyFatory.createSquareBody (w, h, bodyType,options);
		this.createSquareBody = function(width, height, bodyType, options) {
			this.createWorld();
			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;

			var bodyDef = new b2BodyDef;

			//create ground
			bodyDef.type = bodyType;
			bodyDef.position.x = 0;
			bodyDef.position.y = 0;
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(width, height);
			var squareBody = this.world.CreateBody(bodyDef);
			var squareFixture = squareBody.CreateFixture(fixDef);

			return squareBody;
		};

		//var squareBody= Framework.BodyFatory.createCircleBody (r, bodyType,options);
		this.createCircleBody = function(radius, bodyType, options) {
			this.createWorld();
			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;

			var bodyDef = new b2BodyDef;

			//create ground
			bodyDef.type = bodyType;
			bodyDef.position.x = 0;
			bodyDef.position.y = 0;
			fixDef.shape = new b2CircleShape(radius);
			var circleBody = this.world.CreateBody(bodyDef);
			var circleFixture = circleBody.CreateFixture(fixDef);

			return circleBody;
		};

		this.initDebugDraw = function()
		{

			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("__game_canvas__").getContext("2d"));
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			this.world.SetDebugDraw(debugDraw);
		}

		this.draw = function()
		{
			this.world.Step(
				1 / 60   //frame-rate
				,  10       //velocity iterations
				,  10       //position iterations
			);
			this.world.DrawDebugData();
			this.world.ClearForces();
		}


	};
    return Framework;
})(Framework || {});