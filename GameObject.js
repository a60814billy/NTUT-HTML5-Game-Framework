// By Raccoon

var Framework;
Framework = (function (Framework) {
    Framework.GameObject = Framework.Class({
        /**
        * 所有Sprite和Scene的Base Class, 
        * 一般而言, 應該不會直接new它, 而是new其他的concrete class
        * @class GameObject
        * @constructor
        */ 
        __construct:function() {

            /**
            * 相對位置的getter/setter
            * @property position
            * @type {Object} 
            * @default { x: 0, y: 0 }
            */
            Object.defineProperty(this, "position", {
                get: function() {
                    return this.relativePosition;
                },

                set: function(newValue) {
                    if(Framework.Util.isUndefined(newValue.x)) {
                        newValue.x = this.position.x;
                    }
                    if(Framework.Util.isUndefined(newValue.y)) {
                        newValue.y = this.position.y;
                    }

                    this.relativePosition = newValue;
                },
            });

            /**
            * 相對旋轉角度的getter/setter
            * @property rotation
            * @type {number} 
            * @default 0
            */
            Object.defineProperty(this, "rotation", {
                get: function() {
                    return this.relativeRotation;
                },

                set: function(newValue) {
                    this.relativeRotation = newValue;
                },
            });

            /**
            * 相對放大縮小的getter/setter
            * @property scale
            * @type {number} 
            * @default 1
            */
            Object.defineProperty(this, "scale", {
                get: function() {
                    return this.relativeScale;
                },

                set: function(newValue) {
                    this.relativeScale = newValue;
                },
            }); 

            /**
            * 絕對寬度的getter/setter
            * @property width
            * @type {number} 
            * @default 0
            */
            Object.defineProperty(this, "width", {
                get: function() {
                    var width = 0;
                    if(this.texture) {
                        width = this.texture.width;
                    }
                    if (this.col) {
                        width = this.texture.width / this.col;
                    }
                    return width * this.absoluteScale;
                }
            });

            /**
            * 絕對寬度的getter/setter
            * @property height
            * @type {number} 
            * @default 0
            */
            Object.defineProperty(this, "height", {
                get: function() {
                    var height = 0;//this.texture.height;
                    if(this.texture) {
                        height = this.texture.height;
                    }
                    if (this.row) {
                        height = this.texture.height / this.row;
                    }
                    return height * this.absoluteScale;
                }
            });

            //計算以原點為圓心旋轉後的point
            var countRotatePoint = function(point,angle)
            {
                var currentRotate = (angle / 180) * Math.PI,
                    cosRatio = Math.cos(currentRotate),
                    sinRatio = Math.sin(currentRotate),
                    pointX =  point.x * cosRatio - point.y * sinRatio,
                    pointY = point.x * sinRatio + point.y * cosRatio;
                return { x:pointX, y: pointY};
            }

            /**
            * 絕對位置左上角的getter
            * @property upperLeft
            * @type {number} 
            * @default 0
            * @readOnly
            */
            Object.defineProperty(this, "upperLeft", {
                get: function() {    

                    var oriX = -this.width / 2,
                        oriY = -this.height / 2,
                        positionDif = countRotatePoint({x:oriX,y:oriY},this.absoluteRotation);

                    return { x: this.absolutePosition.x + positionDif.x, y: this.absolutePosition.y + positionDif.y };
                }
            });

            /**
            * 絕對位置右上角的getter
            * @property upperRight
            * @type {number}  
            * @default 0
            * @readOnly
            */
            Object.defineProperty(this, "upperRight", {
                get: function() {    

                    var oriX = this.width / 2,
                        oriY = -this.height / 2,
                        positionDif = countRotatePoint({x:oriX,y:oriY},this.absoluteRotation);

                    return { x: this.absolutePosition.x + positionDif.x, y: this.absolutePosition.y + positionDif.y };
                }
            });

            /**
            * 絕對位置左下角的getter
            * @property lowerLeft
            * @type {number}  
            * @default 0
            * @readOnly
            */
            Object.defineProperty(this, "lowerLeft", {
                get: function() {                    
                    
                    var oriX = -this.width / 2,
                        oriY = this.height / 2,
                        positionDif = countRotatePoint({x:oriX,y:oriY},this.absoluteRotation);

                    return { x: this.absolutePosition.x + positionDif.x, y: this.absolutePosition.y + positionDif.y };
                }
            });

            /**
            * 絕對位置右下角的getter
            * @property lowerRight
            * @type {number}  
            * @default 0
            * @readOnly
            */
            Object.defineProperty(this, "lowerRight", {
                get: function() {                    
                 
                    var oriX = this.width / 2,
                        oriY = this.height / 2,
                        positionDif = countRotatePoint({x:oriX,y:oriY},this.absoluteRotation);

                    return { x: this.absolutePosition.x + positionDif.x, y: this.absolutePosition.y + positionDif.y };
                }
            });
            

            this.rotation = 0;
            this.scale = 1;
            this.position = {x: 0, y: 0};

            this.relativePosition = {x:0,y:0};
            this.relativeRotation = 0;
            this.relativeScale = 1;

            this.absolutePosition = {x:0,y:0};
            this.absoluteRotation = 0;
            this.absoluteScale = 1;

            //this.spriteParent = {};
        },

        countAbsoluteProperty: function() {
            var rad,parentRotation = 0,parentScale = 1,parentPositionX = 0,parentPositionY = 0;

            if(this.spriteParent){
                parentRotation = this.spriteParent.absoluteRotation;
                parentScale = this.spriteParent.absoluteScale;
                parentPositionX = this.spriteParent.absolutePosition.x;
                parentPositionY = this.spriteParent.absolutePosition.y;
            }
            this.absoluteRotation = this.rotation + parentRotation;
            this.absoluteScale = this.scale * parentScale;


            rad = (parentRotation / 180) * Math.PI;
            this.absolutePosition.x = Math.floor((this.relativePosition.x * Math.cos(rad) - this.relativePosition.y * Math.sin(rad))) * parentScale + parentPositionX;
            this.absolutePosition.y = Math.floor((this.relativePosition.x * Math.sin(rad) + this.relativePosition.y * Math.cos(rad))) * parentScale + parentPositionY;
        },
        update: function(){},
        draw: function(){},
        toString:function(){return "[GameObject Object]"},
        teardown:function(){}
    });
    return Framework;
})(Framework || {});