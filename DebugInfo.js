var Framework = (function (Framework) {
	Framework.DebugInfo = (function () {
		var _showDebugInfo = false,
            that = {};
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
			newLog.style.minWidth = "600px";	//In order to fill the background color
			newLog.style.padding = "2px 0 2px 5px";
			var logTxt = document.createTextNode("[" + (new Date()).format("hh:mm:ss") + "] " + "[" + state + "] " + str);
			newLog.appendChild(logTxt);
			_debugInfo.appendChild(newLog);
			_debugInfo.scrollTop = _debugInfo.scrollHeight;
			return newLog;
		};

		that.Log = {};

		that.Log.info = function (str) {
			_prepareLog("Info", str).style.backgroundColor = "#80ffff";
		};

		that.Log.error = function (str) {
			_prepareLog("Error", str).style.backgroundColor = "#ff8080";
		};

		that.Log.warring = function (str) {
			_prepareLog("Warring", str).style.backgroundColor = "#ffff80";
		};

		that.Log.console = function (str) {
			if (_showDebugInfo) {
				console.Log(str);
			}
		};

		that.showDebugInfo = function (isShowDebug) {
			_showDebugInfo = isShowDebug;
		};

		that.show = function (dom) {
			if (_showDebugInfo) {
				if (dom) {
					dom.appendChild(_debugInfo);
				} else {
					document.body.appendChild(_debugInfo);
				}
			}
		};
		return that;
	})();

	return Framework;
})(Framework || {});
