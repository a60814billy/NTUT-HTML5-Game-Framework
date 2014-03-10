// By Raccoon
// include namespace
var Framework = (function (Framework) {
    'use strict'
    Framework.Scene = Framework.Class(Framework.GameObject, {
        /**
        * 可以用來盛裝多個GameObject的容器, 當該容器位移時, 其所屬的GameObject也會跟著改變
        *
        * @class Scene
        * @constructor 
        * @extends GameObject
        * @example
        *     new Framework.Scene();
        * 
        */
        __construct: function(options){
			this.id = undefined;
            this.type = undefined;
            this.texture = undefined;
            this.attachArray=[];
            /*this.position = {
                x: this.canvas.width / 2,
                y: this.canvas.height / 2
            }*/
        },

        update: function () {
		    var i;
		    for (i = 0; i < this.attachArray.length ; i++) {
		        this.attachArray[i].update();
		    }
		},

        draw: function(context){
            context = context || Framework.Game._context;            
            this.countAbsoluteProperty();
            var i, target;           
            for (i = 0; i < this.attachArray.length ; i++) {
                this.attachArray[i].draw(this.context);
            }

            if(context instanceof Framework.GameObject) {
                context = context.context;  //表示傳進來的其實是GameObject或其 Concrete Class
            }
            context.drawImage(this.context.canvas, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        /**
        * 將一個Object放進Scene中, 使其可以跟著連動
        * @method attach
        * @param {Object} target 必須是具有update和draw的物件, 
        * 若不符合規定會throw exception
        * @example 
        *     var sprite = new Framework.Sprite('clock.jpg'),
        *         scene = new Framework.Scene();
        *     sprite.position = { x: 100, y: 100 };
        *     scene.position = { x: 100, y: 100 };
        *     scene.attach(sprite);     //如此則Sprite的絕對位置會是在(200, 200)
        */
        attach: function (target) {
            //if (Framework.Util.isUndefined(target.relativePosition)) {
            //    target.relativePosition = target.position || { x: 0, y: 0 };
            //}
            //if (Framework.Util.isUndefined(target.selfRotation)) {
            //    target.selfRotation = target.rotation || 0;
            //}
            //if (Framework.Util.isUndefined(target.selfScale)) {
            //    target.selfScale = target.scale || 1;
            //}
            if(Framework.Util.isUndefined(target)) {
                throw 'target is undefined.';
            }

            if(Framework.Util.isUndefined(target.draw) && Framework.Util.isUndefined(target.update)) {
                throw 'target.draw or target.update is undefined.';
            }

            if(this.layer > target.layer && target.spriteParent) {
                throw 'target is the child of the object which be attached.';
            }

		    this.attachArray.push(target);
            target.spriteParent = this;
            target.layer = this.layer + 1;
		},

        /**
        * 將一個Object移開Scene中, 使其不再跟著連動
        * @method detach
        * @param {Object} target 已經被attach的物件
        * @example 
        *     detach(spriteInstace);
        */
        detach: function (target) {   
            var index = -1, i;
            for(i = 0; i < this.attachArray.length; i++) {
                if(this.attachArray[i] === target) {
                    index = i;
                    break;
                }
            }
            if(index > -1) {
                this.attachArray.splice(index, 1);
                target.spriteParent = {};
                target.layer = 1;   //default
            }
        },

        toString:function(){
            return '[Scene Object]';
        }
    });
    return Framework;
})(Framework || {});