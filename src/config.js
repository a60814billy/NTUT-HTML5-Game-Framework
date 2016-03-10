// By Raccoon
// include namespace
var Framework = (function (Framework) {
	'use strict'
	Framework.Config = function () {
		this.fps = 60;
		this.canvasWidth = 1600;
		this.canvasHeight = 900;
		this.isBackwardCompatiable = false;
	};
	return Framework;
})(Framework || {});
