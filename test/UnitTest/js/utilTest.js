YUI.add("util-test" , function(Y){
    'use strict';
	var Assert = Y.Assert;
	var suite = new Y.Test.Suite("util-test");
	suite.add(new Y.Test.Case({
		name:"Util Test",
		//------------------------------------------------------
		// Setup and Tear down
		//------------------------------------------------------
		setUp:function(){
		},
		tearDown:function(){
		},
		//------------------------------------------------------
		// Tests
		//------------------------------------------------------
		// Test isUndefined
		testIsUndefined1:function(){
			var o;
			Assert.isTrue(Framework.Util.isUndefined(o));
		},
		testIsUndefined2:function(){
			var o = {};
			Assert.isFalse(Framework.Util.isUndefined(o));
		},
		testIsUndefined3:function(){
			var o = {};
			o = null;
			Assert.isFalse(Framework.Util.isUndefined(o));
		},
        //------------------------------------------------------
        // Test isNull
        testIsNull1:function(){
            var o = null;
            Assert.isTrue(Framework.Util.isNull(o));
        },
        testIsNull2:function(){
            var o = {};
            Assert.isFalse(Framework.Util.isNull(o));
        },
        //------------------------------------------------------
        // Test isFunction
        testIsFunction1:function(){
            var o = function(){};
            Assert.isTrue(Framework.Util.isFunction(o));
        },
        testIsFunction2:function(){
            var o = {};
            Assert.isFalse(Framework.Util.isFunction(o));
        },
        testIsFunction3:function(){
            var o = (function(){})();
            Assert.isFalse(Framework.Util.isFunction(o));
        },
        testIsFunction4:function(){
            var o = (function(){}());
            Assert.isFalse(Framework.Util.isFunction(o));
        },
        testIsFunction5:function(){
            var o = (function(){
                return function(){};
            }());
            Assert.isTrue(Framework.Util.isFunction(o));
        },
        //------------------------------------------------------
        // Test isNumber
        testIsNumber1:function(){
            var n = 1;
            Assert.isTrue(Framework.Util.isNumber(n));
        },
        testIsNumber2:function(){
            var n = 10.5;
            Assert.isTrue(Framework.Util.isNumber(n));
        },
        testIsNumber3:function(){
            var n = 10/5;
            Assert.isTrue(Framework.Util.isNumber(n));
        },
        testIsNumber4:function(){
            var n = 10/0;
            Assert.isTrue(Framework.Util.isNumber(n));
        },
        testIsNumber5:function(){
            var n = {};
            Assert.isFalse(Framework.Util.isNumber(n));
        },
        testIsNumber6:function(){
            var n = {} * 10; // NaN  , typeof NaN === 'number' -> true
            Assert.isTrue(Framework.Util.isNumber(n));
        },
        //------------------------------------------------------
        // Test isObject
        testIsObject1:function(){
            var o = {};
            Assert.isTrue(Framework.Util.isObject(o));
        },
        testIsObject2:function(){
            var o = function(){};
            Assert.isFalse(Framework.Util.isObject(o));
        },
        testIsObject3:function(){
            var o = (function(){
                return {};
            }());
            Assert.isTrue(Framework.Util.isObject(o));
        },
        //------------------------------------------------------
        // Test isBoolean
        testIsBoolean1:function(){
            var b = true;
            Assert.isTrue(Framework.Util.isBoolean(b));
        },
        testIsBoolean2:function(){
            var b = false;
            Assert.isTrue(Framework.Util.isBoolean(b));
        },
        testIsBoolean3:function(){
            var b = (true || false) && (false || true);
            Assert.isTrue(Framework.Util.isBoolean(b));
        },
        testIsBoolean4:function(){
            var b = {};
            Assert.isFalse(Framework.Util.isBoolean(b));
        },
        testIsBoolean5:function(){
            var b = [];
            Assert.isFalse(Framework.Util.isBoolean(b));
        },
        //------------------------------------------------------
        // Test isString
        testIsString1:function(){
            var s = "This is a string";
            Assert.isTrue(Framework.Util.isString(s));
        },
        testIsString2:function(){
            var s = {};
            Assert.isFalse(Framework.Util.isString(s));
        },
        testIsString3:function(){
            var s = {};
            Assert.isTrue(Framework.Util.isString(s.toString()));
        },
        //------------------------------------------------------
        // Test isCanvas
        testIsCanvas1:function(){
            var c = document.createElement("canvas");
            Assert.isTrue(Framework.Util.isCanvas(c));
        },
        testIsCanvas2:function(){
            var c = document.createElement("p");
            Assert.isFalse(Framework.Util.isCanvas(c));
        },
        //------------------------------------------------------
        // Test namespace
        testNamespace1:function(){
            Assert.isTrue(Framework.Util.isUndefined(Framework.Test));
            Framework.Util.namespace("Framework.Test");
            Assert.isTrue(!Framework.Util.isUndefined(Framework.Test));
        },
        //------------------------------------------------------
        // Test overrideProperty
        testOverrideProperty1:function(){
            var defaultSettings = {
                s1: 0,
                s2: 0,
                s3: 10,
                s4: 10
            };
            var userSettings = {
                s1: 20,
                s3: 0
            };
            var newSetting = Framework.Util.overrideProperty(defaultSettings , userSettings);
            Assert.areEqual(20 , newSetting.s1);
            Assert.areEqual(0 , newSetting.s2);
            Assert.areEqual(0 , newSetting.s3);
            Assert.areEqual(10, newSetting.s4);
        }
	}));
	Y.Test.Runner.add(suite);

}, '1.0.0', {
	requires: ["test"]
});