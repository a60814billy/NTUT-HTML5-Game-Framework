var framework = (function (framework) {

	framework.Util = {};

	framework.Util.isUndefined = function (obj) {
		return (typeof obj === 'undefined');
	};

	framework.Util.isFunction = function (obj) {
		return (typeof  obj === 'function');
	};

	framework.Util.isNumber = function (obj) {
		return (typeof  obj === 'number');
	};

	framework.Util.isObject = function (obj) {
		return (typeof  obj === 'object');
	};

	framework.Util.isBoolean = function (obj) {
		framework.DebugInfo.log.info(typeof obj);
		return (typeof  obj === 'boolean');
	};

	framework.Util.isString = function (obj) {
		framework.DebugInfo.log.info(typeof obj);
		return (typeof  obj === 'string');
	};

	framework.Util.namespace = function (ns_string) {
		var parts = ns_string.split("."),
			parent = framework,
			i;
		if (parts[0] === "framework") {
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

	framework.overrideProperty = function (defaultSettings, userSettings) {
		for (var key in defaultSettings) {
			if (isUndefined(userSettings[key])) {
				userSettings[key] = defaultSettings[key];
			}
		}
	};

	return framework;
})(framework || {});
