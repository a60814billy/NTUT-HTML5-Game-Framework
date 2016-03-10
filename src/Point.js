var Framework;
Framework = (function (Framework) {
    'use strict'

    Framework.Point = function(x, y) {
        this._x = Math.floor(x);
        this._y = Math.floor(y);
    };

    Object.defineProperty(Framework.Point.prototype, 'x', {
        set: function(newValue) {
            this._x = Math.floor(newValue);       
        },
        get: function() {
            return this._x;
        }
    });

    Object.defineProperty(Framework.Point.prototype, 'y', {
        set: function(newValue) {   
            this._y = Math.floor(newValue);       
        },
        get: function() {
            return this._y;
        }
    });

    return Framework;
})(Framework || {});