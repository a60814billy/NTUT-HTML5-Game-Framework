// By Raccoon

var Framework;
Framework = (function (Framework) {
    Framework.Scene = Framework.Class({
        __construct:function() {

            Object.defineProperty(this, "position", {
                get: function() {
                    return this.relativePosition;
                },

                set: function(newValue) {
                    this.relativePosition = newValue;
                },
            });

            Object.defineProperty(this, "rotation", {
                get: function() {
                    return this.relativeRotation;
                },

                set: function(newValue) {
                    this.relativeRotation = newValue;
                },
            });

            Object.defineProperty(this, "scale", {
                get: function() {
                    return this.relativeScale;
                },

                set: function(newValue) {
                    this.relativeScale = newValue;
                },
            }); 

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

            Object.defineProperty(this, "upperLeft", {
                get: function() {                    
                    return { x: this.absolutePosition.x - this.width / 2, y: this.absolutePosition.y - this.height / 2 };
                }
            });

            Object.defineProperty(this, "upperRight", {
                get: function() {                    
                    return { x: this.absolutePosition.x + this.width / 2, y: this.absolutePosition.y - this.height / 2 };
                }
            });

            Object.defineProperty(this, "lowerLeft", {
                get: function() {                    
                    return { x: this.absolutePosition.x - this.width / 2, y: this.absolutePosition.y + this.height / 2 };
                }
            });

            Object.defineProperty(this, "lowerRight", {
                get: function() {                    
                    return { x: this.absolutePosition.x + this.width / 2, y: this.absolutePosition.y + this.height / 2 };
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

        CountAbsoluteProperty: function() {
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
        isCollided: function (target) {
            var isUpperLeftCollide = (this.upperLeft.x <= target.lowerRight.x && this.upperLeft.y <= target.lowerRight.y),
                isUpperRightCollide = (this.upperRight.x >= target.lowerLeft.x && this.upperRight.y <= target.lowerLeft.y),
                isLowerLeftCollide = (this.lowerLeft.x <= target.upperRight.x && this.lowerLeft.y >= target.upperRight.y),
                isLowerRightCollide = (this.lowerRight.x >= target.upperLeft.x && this.lowerRight.y >= target.upperLeft.y);
            return (isUpperLeftCollide && isUpperRightCollide && isLowerLeftCollide && isLowerRightCollide);
        },
        update: function(){},
        draw: function(){},
        toString:function(){return "[Scene Object]"},
        teardown:function(){}
    });
    return Framework;
})(Framework || {});