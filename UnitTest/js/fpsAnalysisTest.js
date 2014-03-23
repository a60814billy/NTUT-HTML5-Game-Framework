YUI.add("fpsanalysis-test" , function(Y){
    'use strict';
	var suite = new Y.Test.Suite("fpsanalysis-test");
	suite.add(new Y.Test.Case({
		name:"FpsAnalysis Test",
		//------------------------------------------------------
		// Setup and Tear down
		//------------------------------------------------------
		setUp:function(){
			this.fps = new Framework.FpsAnalysis();
		},
		tearDown:function(){
			this.fps = null;
		},
		//------------------------------------------------------
		// Tests
		//------------------------------------------------------
		testCreateFpsAnalysis:function(){
			Y.Assert.areEqual("[FpsAnalysis Object]",this.fps);
		},
		//  FPS 設定在60 測試 update 有沒有正常運作
		testUpdate60:function(){
			var self = this;
			var fps = 60;
			var runUpdateFunction = function(){
				self.fps.update();
			};
			var timer = setInterval(runUpdateFunction , 1000/fps);
			// 用 YUI 提供的 this.wait 等待一定的時間後再測試
			this.wait(function(){
				clearInterval(timer);
				Y.Assert.isTrue(Math.abs(this.fps.getUpdateFPS()-fps) < 5);
			},(1000/fps) * 60 );
		},
		// FPS 設定在30 測試 getUpdateFPS 有沒有正常運作
		testGetUpdateFPS30:function(){
			var self = this;
			var fps = 30;
			var runUpdateFunction = function(){
				self.fps.update();
			};
			var timer = setInterval(runUpdateFunction , 1000/fps);

			this.wait(function(){
				clearInterval(timer);
				Y.Assert.isTrue(Math.abs(this.fps.getUpdateFPS()-fps) < 5);
			},(1000/fps) * 60 );
		}
	}));
	Y.Test.Runner.add(suite);

}, '1.0.0', {
	requires: ["test"]
});