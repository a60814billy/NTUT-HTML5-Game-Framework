// By Raccoon , undyingmoon

var Framework = (function (Framework) {

    Framework.Class = function(){
        "use strict";
        var parent, props , child , f , i;
        if(arguments.length === 1){
            props = arguments[0];
        }else if(arguments.length === 2){
            parent = arguments[0];
            props = arguments[1];
        }

        // 1. new constructor
        child = function(){
            // 這邊應該是要執行uber的constructor，但是會因為參數的順序產生問題..
            if(child.uber && child.uber.hasOwnProperty("__construct")){
                child.uber.__construct.apply(this , arguments);
            }
            if(child.prototype.hasOwnProperty("__construct")){
                child.prototype.__construct.apply(this, arguments);
            }
        };

        // 2. inherit
        parent = parent || Object;
        f = function(){};
        f.prototype = parent.prototype;
        child.prototype = new f();
        child.uber = parent.prototype;
        child.prototype.constructor = child;

        // 3. add implementation methods
        for(i in props){
            if(props.hasOwnProperty(i)){
                child.prototype[i] = props[i];
            }
        }
        return child;
    };

    // Framework.class.create (simulator Inheritance class)
    Framework.inheritance = function (createObj, options) {
        var emptyObj = function () {};
        var newObj = new createObj();
        emptyObj.prototype = createObj.prototype;
        newObj.prototype = new emptyObj;
        newObj.uber = createObj.prototype;
        //讀出所有的屬性，如果不是內建的就加給obj
        for (var option in options) {
            if (options.hasOwnProperty(option)) {
                newObj[option] = options[option];
            }
        }
        return newObj;
    };

    return Framework;
})(Framework || {});