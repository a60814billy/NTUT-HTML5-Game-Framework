var Framework = (function (Framework) {

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
		Framework.DebugInfo.Log.info(typeof obj);
		return (typeof  obj === 'boolean');
	};

	Framework.Util.isString = function (obj) {
		Framework.DebugInfo.Log.info(typeof obj);
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
			if (typeof parent[parts[i]] === "undefined") {
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		return parts;
	};

	Framework.Util.overrideProperty = function (defaultSettings, userSettings) {
		for (var key in defaultSettings) {
			if (isUndefined(userSettings[key])) {
				userSettings[key] = defaultSettings[key];
			}
		}
	};

	return Framework;
})(Framework || {});
