var framework = (function (framework) {
	framework.DebugInfo = (function () {

		var _showDebugInfo = false;

		var _debugInfo = document.createElement("div");
		_debugInfo.style.width = '500px';
		_debugInfo.style.height = '200px';
		_debugInfo.style.backgroundColor = '#f0f0f0';
		_debugInfo.style.position = "absolute";
		_debugInfo.style.top = "10px";
		_debugInfo.style.border = "1px solid #000";
		_debugInfo.style.right = "10px";
		_debugInfo.style.zIndex = "99999";
		_debugInfo.style.overflowY = "scroll";

		var _prepareLog = function (state, str) {
			var newLog = document.createElement("p");
			newLog.style.margin = "0";
			newLog.style.padding = "2px 0 2px 5px";
			var logTxt = document.createTextNode("[" + (new Date()).format("hh:mm:ss") + "] " + "[" + state + "] " + str);
			newLog.appendChild(logTxt);
			_debugInfo.appendChild(newLog);
			_debugInfo.scrollTop = _debugInfo.scrollHeight;
			return newLog;
		};

		this.log = {};

		this.log.info = function (str) {
			_prepareLog("Info", str).style.backgroundColor = "#80ffff";
		};

		this.log.error = function (str) {
			_prepareLog("Error", str).style.backgroundColor = "#ff8080";
		};

		this.log.warring = function (str) {
			_prepareLog("Warring", str).style.backgroundColor = "#ffff80";
		};

		this.log.console = function (str) {
			if (_showDebugInfo) {
				console.log(str);
			}
		};

		this.showDebugInfo = function (isShowDebug) {
			_showDebugInfo = isShowDebug;
		};

		this.show = function (dom) {
			if (_showDebugInfo) {
				if (dom) {
					dom.appendChild(_debugInfo);
				} else {
					document.body.appendChild(_debugInfo);
				}
			}
		};
		return this;
	})();

	return framework;
})(framework || {});
