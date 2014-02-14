// By Raccoon
// include namespace
var Framework = (function (Framework) {
	Framework.Game = (function () {
        var that = {};
		that._isInit = false;
		// gameloop is running ?
		that._isRun = false;
		// gameloop fps
		that._updateFPS = 60;
		that._drawFPS = 60;
		// show fps's div
		that._fpsContext = null;
		// FPS analysis object
		that._fpsAnalysis = new Framework.FpsAnalysis();
		that._drawfpsAnalysis = new Framework.FpsAnalysis();
		// for gameloop -
		that._runInstance = null;
        // game state
        that._levels = [];
        // current level
        that._currentLevel = undefined;

		that._context = null;

		that._tempUpdate = function() {};
		that._tempDraw = function(context) {};


		//Event Handler
		// mouse event
		that.click = function (e) {
            that._currentLevel.click(e);
		};
		that.mousedown = function (e) {
            that._currentLevel.mousedown(e);
		};
		that.mouseup = function (e) {
            that._currentLevel.mouseup(e);
		};
		that.mousemove = function (e) {
            that._currentLevel.mousemove(e);
		};
		// touch event
		that.touchstart = function (e) {
            that._currentLevel.touchstart(e);
		};
		that.touchend = function (e) {
            that._currentLevel.touchend(e);
		};
		that.touchmove = function (e) {
            that._currentLevel.touchmove(e);
		};

		//keyboard Event
		that.keydown = function (e) {
            that._currentLevel.keydown(e);
		};
		that.keyup = function (e) {
            that._currentLevel.keyup(e);
		};
		that.keypress = function (e) {
            that._currentLevel.keypress(e);
		};

		that.eventHandler = function (e) {
			switch (e.type) {
				case "contextmenu":
				case "click":
					that.click(e);
					return false;
					break;
				case "mousedown":
					that.mousedown(e);
					break;
				case "mouseup":
					that.mouseup(e);
					break;
				case "mousemove":
					that.mousemove(e);
					break;
				case "touchstart":
					e.preventDefault();
					that.touchstart(e);
					break;
				case "touchend":
					e.preventDefault();
					that.touchend(e);
					break;
				case "touchmove":
					e.preventDefault();
					that.touchmove(e);
					break;
				/*case "keydown":
					e.preventDefault();
					this.keydown(e);
					break;
				case "keypress":
					e.preventDefault();
					this.keypress(e);
					break;*/
			}
		};

		// defined default Game screen (canvas object)
		that._canvas = document.createElement("canvas");
		that._canvas.setAttribute("id", "__game_canvas__");
		that._canvas.width = innerWidth;
		that._canvas.height = innerHeight;
		that._context = that._canvas.getContext("2d");

		that.initializeProgressResource = function() {
            that._currentLevel.initializeProgressResource();
		};
		that.loadingProgress = function(context) {
            that._currentLevel.loadingProgress(context);
		};
		that.initialize = function () {
            that._currentLevel.initialize();
		};
		that.update = function () {
            that._currentLevel.update();
		};
		that.draw = function () {
            that._currentLevel.draw();
		};

        that._teardown = function(){
            Framework.KeyBoardManager.removeSubject(that._currentLevel);
            if(this._currentLevel.autoDelete){
                this._currentLevel.autodelete();
            }
        };

        that._findLevel = function(name){
            for(var i= 0,l=that._levels.length;i<l;i++){
                if(that._levels[i].name === name ){
                    return that._levels[i].level;
                }
            }
            return null;
        };

        // Level
        that.addNewLevel = function(leveldata){
            console.dir(leveldata);
            for(var i in leveldata){
                if(leveldata.hasOwnProperty(i)){
                    if(Framework.Util.isNull(that._findLevel(i))){
                        that._levels.push({name : i , level : leveldata[i]});
                    }else{
                        Framework.DebugInfo.Log.error("Game : 關卡名稱不能重複");
                        throw new Error("Game: already has same level name");
                    }
                }
            }
        };

        that.goToLevel = function(levelName){
            that.stop();
            that._teardown();
            that._currentLevel = that._findLevel(levelName);
            if(Framework.Util.isUndefined(that._currentLevel)){
                Framework.DebugInfo.Log.error("Game : 找不到關卡");
                throw new Error("Game : levelname not found.");
            }
            that.start();
        };

        that.goToNextLevel = function(){
            that.stop();
            that._teardown();
            var flag = false;
            for(var i in that._levels){
                if(flag){
                    that._currentLevel = that._levels[i].level;
                    that.start();
                    return;
                }
                if(that._levels[i].level === that._currentLevel){
                    flag = true;
                }
            }
            Framework.DebugInfo.Log.error("Game : 無下一關");
            throw new Error("Game : can't goto next level.");
        };

        that.goToPreviousLevel = function(){
            that.stop();
            that._teardown();
            var flag = false;
            var prev = undefined;
            for(var i in that._levels){
                if(that._levels[i].level === that._currentLevel){
                    if(!Framework.Util.isUndefined(prev)){
                        that._currentLevel = prev;
                        that.start();
                        return;
                    }
                    break;
                }
                prev = that._levels[i].level;
            }
            Framework.DebugInfo.Log.error("Game : 無前一關");
            throw new Error("Game : can't goto previous level.");
        };

		that.start = function () {
            if(Framework.Util.isUndefined(that._currentLevel)){
                that._currentLevel = that._levels[0].level;
            }
            var self = that;

            if(!that._isInit){
                document.body.appendChild(that._canvas);
                that._canvas.addEventListener("click", function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener("mousedown", function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener("mouseup", function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener("mousemove", function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener("touchstart", function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener("touchend", function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener("touchmove", function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener("contextmenu", function (e) {
                    self.eventHandler(e);
                });
            }

			that._tempDraw = self._currentLevel.draw;
			that._tempUpdate = self._currentLevel.update;
			that.initializeProgressResource();


			var runFunction = function() {
				self._isRun = true;
				self.stop();
				self.draw = self._tempDraw.bind(self._currentLevel);
				self.update = self._tempUpdate.bind(self._currentLevel);
				self.run();
			};

			var	initFunction = function() {
				self._isInit = true;					
				self.draw = self.loadingProgress;
				self.update = function() {};
				self.run();
				self._isRun = false;
				self.initialize();
				if(Framework.ResourceManager.getRequestCount() ===  Framework.ResourceManager.getResponseCount()) {
					runFunction();
				}
			};

			Framework.ResourceManager.setSubjectFunction(function() {				
				if(!self._isInit) {
					initFunction();
					return;
				}

				if (!self._isRun) {
					runFunction();
				}
			});

			
			//if(Framework.ResourceManager.getRequestCount() === 0) {
				initFunction();
			//}

			Framework.KeyBoardManager.addSubject(self._currentLevel);
			Framework.KeyBoardManager.setKeyupEvent(self._currentLevel.keyup);
			Framework.KeyBoardManager.setKeydownEvent(self._currentLevel.keydown);
			
		};

		that.run = function () {
			// dynamic product runnable function
			that._run = (function (that) {
				// local variable for Game loop use
				var nextGameTick = (new Date()).getTime();
				var skipTicks = 1000 / that._updateFPS;
				return function () {
					while ((new Date()).getTime() > nextGameTick) {
						// update FPS counter
						that._fpsAnalysis.update();
						// show FPS information
						if (that.fpsContext) that.fpsContext.innerHTML = "update FPS:" + that._fpsAnalysis.getUpdateFPS() + "<br />draw FPS:" + that._drawfpsAnalysis.getUpdateFPS();
						// run Game's update
						that.update();
						// setup next run update time
						nextGameTick += skipTicks;
					}
					// run Game's draw
					that._context.clearRect(0,0,that._canvas.width , that._canvas.height);
					that.draw(that._context);
					that._drawfpsAnalysis.update();
					if (that.fpsContext) that.fpsContext.innerHTML = "update FPS:" + that._fpsAnalysis.getUpdateFPS() + "<br />draw FPS:" + that._drawfpsAnalysis.getUpdateFPS();
				}
			})(that);
			that._runInstance = setInterval(that._run, 1000 / that._drawFPS);
			that._isRun = true;
		};

		that.stop = function () {
			if (that._isRun) {
				clearInterval(that._runInstance);
				that._runInstance = null;
				that._isRun = false;
			}
		};

		// propetity
		that.setUpdateFPS = function (fps) {
			that._updateFPS = fps;
			that.stop();
			that.run();
		};

		that.getUpdateFPS = function () {
			return that._updateFPS;
		};

		that.setDrawFPS = function (fps) {
			if (fps > 60) {
				Framework.DebugInfo.Log.warring("FPS must be smaller than 60");
				fps = 60;
			}
			that._drawFPS = fps;
			that.stop();
			that.run();
		};

		that.getDrawFPS = function () {
			return that._drawFPS;
		};

		that.setCanvas = function (canvas) {
			if (canvas) {
				that._canvas = null;
				that._context = null;
				that._canvas = canvas;
				that._context = that._canvas.getContext("2d");
			}
		};

		that.setContext = function (context) {
			if (context) {
				that.context = null;
				that._canvas = null;
				that.context = context;
			} else {
				Framework.DebugInfo.Log.error("Game SetContext Error")
			}
		};

		that.getContext = function () {
			return that.context;
		};
		return that;
	})();
	return Framework;
})(Framework || {});
