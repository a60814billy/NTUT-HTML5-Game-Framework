// By Raccoon
// include namespace
var Framework = (function (Framework) {
	Framework.Game = function () {
		// ensure forget use new keyword to call this function
		// as work as use new keyword.
		if (!(this instanceof Framework.Game)){
            Framework.DebugInfo.Log.error("Game error : 必須要使用new關鍵字");
            throw new SyntaxError("must be use new keyword on Game");
        }

		this._isInit = false;
		// gameloop is running ?
		this._isRun = false;
		// gameloop fps
		this._updateFPS = 60;
		this._drawFPS = 60;
		// show fps's div
		this._fpsContext = null;
		// FPS analysis object
		this._fpsAnalysis = new Framework.FpsAnalysis();
		this._drawfpsAnalysis = new Framework.FpsAnalysis();
		// for gameloop -
		this._runInstance = null;

		this._context = null;

		this._tempUpdate = function() {};
		this._tempDraw = function(context) {};


		//Event Handler
		// mouse event
		this.click = function (e) {
		};
		this.mousedown = function (e) {
		};
		this.mouseup = function (e) {
		};
		this.mousemove = function (e) {
		};
		// touch event
		this.touchstart = function (e) {
		};
		this.touchend = function (e) {
		};
		this.touchmove = function (e) {
		};

		//
		this.keydown = function (e) {
		};
		this.keyup = function (e) {
		};
		this.keypress = function (e) {
		};

		this.eventHandler = function (e) {
			switch (e.type) {
				case "contextmenu":
				case "click":
					this.click(e);
					return false;
					break;
				case "mousedown":
					this.mousedown(e);
					break;
				case "mouseup":
					this.mouseup(e);
					break;
				case "mousemove":
					this.mousemove(e);
					break;
				case "touchstart":
					e.preventDefault();
					this.touchstart(e);
					break;
				case "touchend":
					e.preventDefault();
					this.touchend(e);
					break;
				case "touchmove":
					e.preventDefault();
					this.touchmove(e);
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
		this._canvas = document.createElement("canvas");
		this._canvas.setAttribute("id", "__game_canvas__");
		this._canvas.width = innerWidth;
		this._canvas.height = innerHeight;
		this._context = this._canvas.getContext("2d");

		this.initializeProgressResource = function() {
		};
		this.loadingProgress = function(context) {
		};
		this.initialize = function () {
		};
		this.update = function () {
		};
		this.draw = function () {
		};

		this.start = function () {
			document.body.appendChild(this._canvas);			
			var self = this;
			this._tempDraw = self.draw;
			this._tempUpdate = self.update;	
			this.initializeProgressResource();
			this._canvas.addEventListener("click", function (e) {
				self.eventHandler(e);
			});
			this._canvas.addEventListener("mousedown", function (e) {
				self.eventHandler(e);
			});
			this._canvas.addEventListener("mouseup", function (e) {
				self.eventHandler(e);
			});
			this._canvas.addEventListener("mousemove", function (e) {
				self.eventHandler(e);
			});
			this._canvas.addEventListener("touchstart", function (e) {
				self.eventHandler(e);
			});
			this._canvas.addEventListener("touchend", function (e) {
				self.eventHandler(e);
			});
			this._canvas.addEventListener("touchmove", function (e) {
				self.eventHandler(e);
			});
			this._canvas.addEventListener("contextmenu", function (e) {
				self.eventHandler(e);
			});

			var runFunction = function() {
				self._isRun = true;
				self.stop();
				self.draw = self._tempDraw;
				self.update = self._tempUpdate;
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

			
			if(Framework.ResourceManager.getRequestCount() === 0) {
				initFunction();
			}

			Framework.KeyBoardManager.addSubject(self);
			Framework.KeyBoardManager.setKeyupEvent(self.keyup);
			Framework.KeyBoardManager.setKeydownEvent(self.keydown);
			
		};

		this.run = function () {
			// dynamic product runnable function
			this._run = (function (that) {
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
			})(this);
			this._runInstance = setInterval(this._run, 1000 / this._drawFPS);
			this._isRun = true;
		};

		this.stop = function () {
			if (this._isRun) {
				clearInterval(this._runInstance);
				this._runInstance = null;
				this._isRun = false;
			}
		};

		// propetity
		this.setUpdateFPS = function (fps) {
			this._updateFPS = fps;
			this.stop();
			this.run();
		};

		this.getUpdateFPS = function () {
			return this._updateFPS;
		};

		this.setDrawFPS = function (fps) {
			if (fps > 60) {
				Framework.DebugInfo.Log.warring("FPS must be smaller than 60");
				fps = 60;
			}
			this._drawFPS = fps;
			this.stop();
			this.run();
		};

		this.getDrawFPS = function () {
			return this._drawFPS;
		};

		this.setCanvas = function (canvas) {
			if (canvas) {
				this._canvas = null;
				this._context = null;
				this._canvas = canvas;
				this._context = this._canvas.getContext("2d");
			}
		};

		this.setContext = function (context) {
			if (context) {
				this.context = null;
				this._canvas = null;
				this.context = context;
			} else {
				Framework.DebugInfo.Log.error("Game SetContext Error")
			}
		};

		this.getContext = function () {
			return this.context;
		};
		return this;
	};
	return Framework;
})(Framework || {});
