// By Raccoon
var Framework;
Framework = (function (Framework) {
    'use strict'

    Framework.GameObject = Framework.exClass({        
        /**
        * 所有Sprite和Scene的Base Class, 
        * 一般而言, 應該不會直接new它, 而是new其他的concrete class
        * @class GameObject
        * @constructor
        */ 
        __construct: function() {    
            this.relativePosition = new Framework.Point();
            this.relativeRotation = 0;
            this.relativeScale = 1;

            this.absolutePosition = { x: 0, y: 0 };
            this.absoluteRotation = 0;
            this.absoluteScale = 1;
            this.systemLayer = 1;  
            //this.spriteParent = {};
        
            this.previousAbsolutePosition = new Framework.Point();
            this.previousWidth = 0;
            this.previousHeight = 0;

            this.rotation = 0;
            this.scale = 1;
            this.position = { x: 0, y: 0 };

            this._isRotate = true;
            this._isScale = true;
            this._isMove = true;
            this._changeFrame = true;
            this._isCountAbsolute = false;
        },

        clearDirtyFlag: function() {
            this._isRotate = false;
            this._isScale = false;
            this._isMove = false;
            this._changeFrame = false;
        },

        pushSelfToLevel: function() {
            Framework.Game._pushGameObj(this);
        },

        countAbsoluteProperty: function() {            
            var rad, parentRotation = 0, parentScale = 1, parentPositionX = 0, parentPositionY = 0;

            this.previousAbsolutePosition.x = this.absolutePosition.x;
            this.previousAbsolutePosition.y = this.absolutePosition.y;
            this.previousWidth = this.width;
            this.previousHeight = this.height;

            if (!Framework.Util.isUndefined(this.spriteParent)) {
                parentRotation = this.spriteParent.absoluteRotation;
                parentScale = this.spriteParent.absoluteScale;
                parentPositionX = this.spriteParent.absolutePosition.x;
                parentPositionY = this.spriteParent.absolutePosition.y;
            }

            rad = (parentRotation / 180) * Math.PI;
            var changedRotate = this.rotation + parentRotation, 
                changedScale = this.scale * parentScale, 
                changedPositionX = Math.floor((this.relativePosition.x * Math.cos(rad) - this.relativePosition.y * Math.sin(rad))) * parentScale + parentPositionX, 
                changedPositionY = Math.floor((this.relativePosition.x * Math.sin(rad) + this.relativePosition.y * Math.cos(rad))) * parentScale + parentPositionY;
                //changedPositionX = this.relativePosition.x + parentPositionX, 
                //changedPositionY = this.relativePosition.y + parentPositionY;

            if(this.absoluteRotation !== changedRotate) {
                this._isRotate = true;
            }

            if(this.absoluteScale !== changedScale) {
                this._isScale = true;
            }

            if(this.absolutePosition.x !== changedPositionX || this.absolutePosition.y !== changedPositionY) {
                this._isMove = true;
            }

            this.absoluteRotation = changedRotate;
            this.absoluteScale = changedScale;

            this.absolutePosition.x = changedPositionX;
            this.absolutePosition.y = changedPositionY;

            if(Array.isArray(this.attachArray)) {
                this.attachArray.forEach(function(ele) {
                    if(!Framework.Util.isUndefined(ele.countAbsoluteProperty))
                    {
                        ele.countAbsoluteProperty();
                    }

                });
            }
        },
        load: function() {},  
        initialize: function() {},  
        update: function() {},
        draw: function(ctx) {},        
        teardown:function() {},
        toString:function() { return '[GameObject Object]'}
    });

    Object.defineProperty(Framework.GameObject.prototype, 'isObjectChanged', {
        get: function() {
            var isParentChanged = false;
            /*if(!Framework.Util.isUndefined(this.spriteParent)) {
                isParentChanged = this.spriteParent.isObjectChanged;
            }*/
            
            if(!Framework.Util.isUndefined(this.attachArray)) {
                this.attachArray.forEach(function(ele) {
                    if(ele.isObjectChanged) {
                       isParentChanged  = true;
                   }
                });
            }

            return this._isRotate || this._isScale || this._isMove || this._changeFrame || isParentChanged;
        }
    });

    Object.defineProperty(Framework.GameObject.prototype, 'isOnChangedRect', {
        get: function() {
            var halfDiagonal = this.diagonal / 2,
                thisRect = { x: this.absolutePosition.x - halfDiagonal, 
                    y: this.absolutePosition.y - halfDiagonal,
                    x2: this.absolutePosition.x + halfDiagonal, 
                    y2: this.absolutePosition.y + halfDiagonal,
                },
                changedRect = Framework.Game._currentLevel._getChangedRect(1600, 900);

            if((thisRect.x < changedRect.x2 && thisRect.y < changedRect.y2) || 
                (thisRect.x2 > changedRect.x && thisRect.y2 > changedRect.y) ||
                (thisRect.x2 > changedRect.x && thisRect.y2 < changedRect.y) ||
                (thisRect.x2 < changedRect.x && thisRect.y2 > changedRect.y)) {
                return true;
            }

            return false;

        }
    });

    /**
    * 相對位置的getter/setter
    * @property position
    * @type {Object} 
    * @default { x: 0, y: 0 }
    */
    Object.defineProperty(Framework.GameObject.prototype, 'position', {
        get: function() {   
            //this._isChanged = false;
            return this.relativePosition;
        },

        set: function(newValue) {
            if(!Framework.Util.isUndefined(newValue.x)) {               
                this.relativePosition.x = Math.floor(newValue.x);
                //this._isMove = true;
            }   

            if(!Framework.Util.isUndefined(newValue.y)) {
                this.relativePosition.y = Math.floor(newValue.y);
                //this._isMove = true;
            }
        },
    });

    /**
    * 相對旋轉角度的getter/setter
    * @property rotation
    * @type {number} 
    * @default 0
    */
    Object.defineProperty(Framework.GameObject.prototype, 'rotation', {
        get: function() {
            return this.relativeRotation;
        },

        set: function(newValue) {
            this.relativeRotation = newValue;
            //this._isRotate = true;
        },
    });

    /**
    * 相對放大縮小的getter/setter
    * @property scale
    * @type {number} 
    * @default 1
    */
    Object.defineProperty(Framework.GameObject.prototype, 'scale', {
        get: function() {
            return this.relativeScale;
        },

        set: function(newValue) {
            this.relativeScale = newValue;
            //this._isScale = true;
        },
    }); 

    /**
    * 絕對寬度的getter/setter
    * @property width
    * @type {number} 
    * @default 0
    */
    Object.defineProperty(Framework.GameObject.prototype, 'width', {
        get: function() {
            var width = 0;
            if(this.texture) {
                width = this.texture.width;
            }
           /* if (this.col) {
                width = this.texture.width / this.col;
            }*/
            return Math.floor(width * this.absoluteScale);
        }
    });

    /**
    * 絕對寬度的getter/setter
    * @property height
    * @type {number} 
    * @default 0
    */
    Object.defineProperty(Framework.GameObject.prototype, 'height', {
        get: function() {
            var height = 0;//this.texture.height;
            if(this.texture) {
                height = this.texture.height;
            }
            /*if (this.row) {
                height = this.texture.height / this.row;
            }*/
            return Math.floor(height * this.absoluteScale);
        }
    });

    Object.defineProperty(Framework.GameObject.prototype, 'diagonal', {
        get: function() {
            return Math.sqrt(this.width * this.width + this.height * this.height);
        }
    });

    //計算以原點為圓心旋轉後的point
    var countRotatePoint = function(point, angle)
    {
        var currentRotate = (angle / 180) * Math.PI,
            cosRatio = Math.cos(currentRotate),
            sinRatio = Math.sin(currentRotate),
            pointX =  point.x * cosRatio - point.y * sinRatio,
            pointY = point.x * sinRatio + point.y * cosRatio;
        return { x: pointX, y: pointY };
    }

    /**
    * 絕對位置左上角的getter
    * @property upperLeft
    * @type {number} 
    * @default 0
    * @readOnly
    */
    Object.defineProperty(Framework.GameObject.prototype, 'upperLeft', {
        get: function() {    

            var oriX = -this.width / 2,
                oriY = -this.height / 2,
                positionDif = countRotatePoint({x:oriX,y:oriY},this.absoluteRotation);

            return { x: Math.floor(this.absolutePosition.x + positionDif.x), y: Math.floor(this.absolutePosition.y + positionDif.y) };
        }
    });

    /**
    * 絕對位置右上角的getter
    * @property upperRight
    * @type {number}  
    * @default 0
    * @readOnly
    */
    Object.defineProperty(Framework.GameObject.prototype, 'upperRight', {
        get: function() {    

            var oriX = this.width / 2,
                oriY = -this.height / 2,
                positionDif = countRotatePoint({x:oriX,y:oriY},this.absoluteRotation);

            return { x: Math.floor(this.absolutePosition.x + positionDif.x), y: Math.floor(this.absolutePosition.y + positionDif.y) };
        }
    });

    /**
    * 絕對位置左下角的getter
    * @property lowerLeft
    * @type {number}  
    * @default 0
    * @readOnly
    */
    Object.defineProperty(Framework.GameObject.prototype, 'lowerLeft', {
        get: function() {                    
            
            var oriX = -this.width / 2,
                oriY = this.height / 2,
                positionDif = countRotatePoint({x:oriX,y:oriY},this.absoluteRotation);

            return { x: Math.floor(this.absolutePosition.x + positionDif.x), y: Math.floor(this.absolutePosition.y + positionDif.y) };
        }
    });

    /**
    * 絕對位置右下角的getter
    * @property lowerRight
    * @type {number}  
    * @default 0
    * @readOnly
    */
    Object.defineProperty(Framework.GameObject.prototype, 'lowerRight', {
        get: function() {                    
         
            var oriX = this.width / 2,
                oriY = this.height / 2,
                positionDif = countRotatePoint({x:oriX,y:oriY},this.absoluteRotation);

            return { x: Math.floor(this.absolutePosition.x + positionDif.x), y: Math.floor(this.absolutePosition.y + positionDif.y) };
        }
    });
    
    Object.defineProperty(Framework.GameObject.prototype, 'layer', {
       set: function(newValue) {
           this.systemLayer = newValue;
           if(!Framework.Util.isUndefined(this.attachArray)) {
               this.attachArray.forEach(function(o) {
                   o.layer = newValue + 1; 
               });
           }
       },
       get: function() {
           return this.systemLayer;
       }
    });

    Object.defineProperty(Framework.GameObject.prototype, 'canvas', {               
       get: function() {
            if(!Framework.Util.isUndefined(this._selfCanvas)) {
                return this._selfCanvas;
            }
                              
            this._selfCanvas =  document.createElement('canvas');
            var diagonalLength = Math.ceil(Math.sqrt(Math.pow(this.height, 2) + Math.pow(this.width, 2)));
            this._selfCanvas.width = diagonalLength;
            this._selfCanvas.height = diagonalLength;
            if(this.width === 0 && this.height === 0) {
                /*this._selfCanvas = Framework.Game._canvas;
                return this._selfCanvas;*/
                this._selfCanvas.width = Framework.Game._canvas.width;
                this._selfCanvas.height = Framework.Game._canvas.height;
            } 
            return this._selfCanvas;
       }
    });

    Object.defineProperty(Framework.GameObject.prototype, 'context', {               
       get: function() {                    
            return this.canvas.getContext('2d');
       }
    });
    return Framework;
})(Framework || {});