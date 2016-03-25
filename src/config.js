// By Raccoon
// include namespace
var Framework = (function (Framework) {
	'use strict'
	Framework.Config = function () {
		this.fps = 60;
		this.canvasWidth = 1350;
		this.canvasHeight = 700;
		// this.canvasWidth = 1600;
		// this.canvasHeight = 900;
		this.isBackwardCompatiable = false;
		this.isOptimize = false;
		this.isMouseMoveRecorded = true;
	};
	return Framework;
})(Framework || {});
