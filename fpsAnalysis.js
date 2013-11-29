// By Raccoon
// include namespace
var Framework = (function (Framework) {
	Framework.FpsAnalysis = function () {
		if (!(this instanceof arguments.callee)) return new arguments.callee();
		var timeData = new Array(50);
		var fpsData = new Array(50);
		for (var i = 0; i < fpsData.length; i++) {
			timeData[i] = 0;
			fpsData[i] = 0;
		}
		var currentPoint = 1;
		var fps = 0;
		timeData[0] = (new Date()).getTime();
		return {
			update      : function () {
				timeData[currentPoint] = (new Date()).getTime();
				fps -= fpsData[currentPoint];
				fpsData[currentPoint] = timeData[currentPoint] - (currentPoint == 0 ? timeData[timeData.length - 1] : timeData[currentPoint - 1]);
				fps += fpsData[currentPoint];
				currentPoint = (++currentPoint) % fpsData.length;
			},
			getUpdateFPS: function () {
				return Math.floor(1000 / (fps / fpsData.length));
			}
		};
	};
	return Framework;
})(Framework || {});
