var Framework = (function (Framework) {
    // 宣告 namespace
	Framework.Util = {};

	Framework.Util.isUndefined = function (obj) {
		return (typeof obj === 'undefined');
	};

	Framework.Util.isFunction = function (obj) {
		return (typeof  obj === 'function');
	};

	Framework.Util.isNumber = function (obj) {
		return (typeof  obj === 'number');
	};

	Framework.Util.isObject = function (obj) {
		return (typeof  obj === 'object');
	};

	Framework.Util.isBoolean = function (obj) {
		return (typeof  obj === 'boolean');
	};

	Framework.Util.isString = function (obj) {
		return (typeof  obj === 'string');
	};

	Framework.Util.namespace = function (ns_string) {
		var parts = ns_string.split("."),
			parent = Framework,
			i;
		if (parts[0] === "Framework") {
			parts = parts.slice(1);
		}
		for (i = 0; i < parts.length; i += 1) {
			if ( Framework.Util.isUndefined(typeof parent[parts[i]])) {
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		return parts;
	};

	Framework.Util.overrideProperty = function (defaultSettings, userSettings) {
		for (var key in defaultSettings) {
			if (Framework.Util.isUndefined(userSettings[key])) {
				userSettings[key] = defaultSettings[key];
			}
		}
		return userSettings;
	};
	return Framework;
})(Framework || {});

// Extend Date's function , add format method
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};