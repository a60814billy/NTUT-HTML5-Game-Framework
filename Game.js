// By Raccoon
// include namespace
var Framework = (function (Framework) {
	'use strict'
	/**
    * 整個遊戲(多個{{#crossLink "Level"}}{{/crossLink}})的主體
    * 主要功能為新增移除關卡與關卡的切換
    * @class Game
    */ 
	Framework.Game = (function () {
        var that = {};
		that._isInit = false;
		// gameloop is running ?
		that._isRun = false;
		// gameloop fps
		that._updateFPS = 60;
		that._drawFPS = 60;
		// show fps's div
		that._fpsContext = undefined;
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
				case 'contextmenu':
				case 'click':
					that.click(e);
					return false;
					break;
				case 'mousedown':
					e.x = e.x || e.clientX;
					e.y = e.y || e.clientY;
					that.mousedown(e);
					break;
				case 'mouseup':
					e.x = e.x || e.clientX;
					e.y = e.y || e.clientY;
					that.mouseup(e);
					break;
				case 'mousemove':
					e.x = e.x || e.clientX;
					e.y = e.y || e.clientY;
					that.mousemove(e);
					break;
				case 'touchstart':
					e.preventDefault();
					that.touchstart(e);
					break;
				case 'touchend':
					e.preventDefault();
					that.touchend(e);
					break;
				case 'touchmove':
					e.preventDefault();
					that.touchmove(e);
					break;
				/*case 'keydown':
					e.preventDefault();
					this.keydown(e);
					break;
				case 'keypress':
					e.preventDefault();
					this.keypress(e);
					break;*/
			}
		};

		// defined default Game screen (canvas object)
		that._canvas = document.createElement('canvas');
		that._canvas.setAttribute('id', '__game_canvas__');
		that._canvas.width = window.innerWidth;
		that._canvas.height = window.innerHeight;
		that._context = that._canvas.getContext('2d');

		that.initializeProgressResource = function() {
            that._currentLevel._initializeProgressResource();
		};
		that.loadingProgress = function(context) {
            that._currentLevel._loadingProgress(context, { request: Framework.ResourceManager.getRequestCount(), response: Framework.ResourceManager.getResponseCount(), percent: Framework.ResourceManager.getFinishedRequestPercent()});
		};
		that.initialize = function () {
            that._currentLevel._initialize();
		};
		that.update = function () {
            that._currentLevel._update();
		};
		that.draw = function () {
            that._currentLevel._draw();
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

        /**
		* 加入一個新的關卡	
		* @method addNewLevel
		* @static
		* @param {Object} levelData { 關卡名稱: 關卡的instance }
		* @example
		* 	Framework.Game.addNewLevel({menu: new MyMenu()});	//MyMen繼承自Level
		*/
        that.addNewLevel = function(leveldata){
            //console.dir(leveldata);
            for(var i in leveldata){
                if(leveldata.hasOwnProperty(i)){
                    if(Framework.Util.isNull(that._findLevel(i))){
                        that._levels.push({name : i , level : leveldata[i]});
                    }else{
                        Framework.DebugInfo.Log.error('Game : 關卡名稱不能重複');
                        throw new Error('Game: already has same level name');
                    }
                }
            }
        };

        /**
		* 前往另一個關卡(前後皆可), 若沒有該關卡, 會throw exception	
		* @method goToLevel
		* @static
		* @param {Object} levelName 關卡名稱
		* @example
		* 	Framework.Game.goToLevel('menu');
		*/
        that.goToLevel = function(levelName){
            that.stop();
            that._teardown();
            that._currentLevel = that._findLevel(levelName);
            if(Framework.Util.isUndefined(that._currentLevel)){
                Framework.DebugInfo.Log.error('Game : 找不到關卡');
                throw new Error('Game : levelname not found.');
            }
            that.start();
        };

        /**
		* 前往下一個關卡, 若沒有下一個關卡, 會throw exception	
		* @method goToNextLevel
		* @static
		* @example
		* 	Framework.Game.goToNextLevel();
		*/
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
            Framework.DebugInfo.Log.error('Game : 無下一關');
            throw new Error('Game : can\'t goto next level.');
        };

        /**
		* 前往前一個關卡, 若沒有前一個關卡, 會throw exception	
		* @method goToPreviousLevel
		* @static
		* @example
		* 	Framework.Game.goToPreviousLevel();
		*/
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
            Framework.DebugInfo.Log.error('Game : 無前一關');
            throw new Error('Game : can\'t goto previous level.');
        };


        /**
		* 讓遊戲開始執行
		* @method start
		* @static
		* @example
		* 	Framework.Game.start();
		*/
		that.start = function () {
            if(Framework.Util.isUndefined(that._currentLevel)){
                that._currentLevel = that._levels[0].level;
            }
            var self = that;

            if(!that._isInit){
                document.body.appendChild(that._canvas);
                that._canvas.addEventListener('click', function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener('mousedown', function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener('mouseup', function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener('mousemove', function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener('touchstart', function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener('touchend', function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener('touchmove', function (e) {
                    self.eventHandler(e);
                });
                that._canvas.addEventListener('contextmenu', function (e) {
                    self.eventHandler(e);
                });
            }

			that._tempDraw = self._currentLevel._draw;
			that._tempUpdate = self._currentLevel._update;
			that.initializeProgressResource();


			var runFunction = function() {
				self._isRun = true;
				self.stop();
				//bind會產生一個同樣的function, 但this為指定的參數
				self.draw = self._tempDraw.bind(self._currentLevel);
				self.update = self._tempUpdate.bind(self._currentLevel);
				self.run();
			};

			var	initFunction = function() {
				if (Framework.ResourceManager.getRequestCount() !==  Framework.ResourceManager.getResponseCount()) {
					return;
				}
				self._isInit = true;					
				self.draw = self.loadingProgress;
				self.update = function() {};
				self.run();
				self._isRun = false;
				self.initialize();
				if (Framework.ResourceManager.getRequestCount() ===  Framework.ResourceManager.getResponseCount()) {
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

		that.run = function() {			
			var updateFunc = function() {				
					that._fpsAnalysis.update();
					// show FPS information
					if (that.fpsContext) {
						that.fpsContext.innerHTML = 'update FPS:' + that._fpsAnalysis.getUpdateFPS() + '<br />draw FPS:' + that._drawfpsAnalysis.getUpdateFPS();
					}							
					// run Game's update
					that.update();							
			};

			var drawFunc = function() {
				that._context.clearRect(0, 0, that._canvas.width, that._canvas.height);			
				that.draw(that._context);
				that._drawfpsAnalysis.update();
				if (that.fpsContext) {
					that.fpsContext.innerHTML = 'update FPS:' + that._fpsAnalysis.getUpdateFPS() + '<br />draw FPS:' + that._drawfpsAnalysis.getUpdateFPS();
				}
			};

			that.runAnimationFrame(updateFunc, drawFunc);
			that._isRun = true;
		};
		
		that.runAnimationFrame = function (updateFunc, drawFunc) {
			// dynamic product runnable function
			var self = that,			
				updateTicks = 1000 / that._updateFPS,
				drawTicks = 1000 / that._drawFPS,
				previousUpdateTime = updateTicks,
				previousDrawTime = drawTicks;

			var _run = function (timeStamp) {	
				that._runInstance = requestAnimationFrame(_run);			
				while ((timeStamp - updateTicks > previousUpdateTime)) {
					updateFunc();					
					previousUpdateTime += updateTicks;
				}

				//一般而言, 要update的時候, 應該也已經要draw了, 故不多加if判斷是否要draw
				drawFunc();
				previousDrawTime = timeStamp;
			};
			_run();
		};						

		that.runInterval = function (updateFunc, drawFunc) {
			// dynamic product runnable function
			var self = that,
				nowFunc = function() { return (new Date()).getTime(); },				
				updateTicks = 1000 / that._updateFPS,
				drawTicks = 1000 / that._drawFPS,
				now = nowFunc(),
				previousUpdateTime = nowFunc(),
				previousDrawTime = nowFunc();
			var _run = function () {	
					now = nowFunc();			
					while (now - updateTicks > previousUpdateTime) {
						updateFunc();						
						previousUpdateTime += updateTicks;
					}

					//一般而言, 要update的時候, 應該也已經要draw了, 故不多加if判斷是否要draw
					drawFunc();
					previousDrawTime = now;
				};
			that._runInstance = setInterval(_run, drawTicks);			
		};

		that.stopInterval = function() {
			clearInterval(that._runInstance);
		};

		that.stopAnimationFrame = function() {
			cancelAnimationFrame(that._runInstance);
		};

		that.stop = function () {
			if (that._isRun) {
				that.stopAnimationFrame();
				that._runInstance = null;
				that._isRun = false;
			}
		};

		// propetity
		that.setUpdateFPS = function (fps) {
			if (fps > 60) {
				Framework.DebugInfo.Log.warring('FPS must be smaller than 60.');
				throw 'FPS must be smaller than 60.';
				fps = 60;
			}
			that._updateFPS = fps;
			that.stop();
			that.run();
		};

		that.getUpdateFPS = function () {
			return that._updateFPS;
		};

		that.setDrawFPS = function (fps) {
			if (fps > 60) {
				Framework.DebugInfo.Log.warring('FPS must be smaller than 60.');
				throw 'FPS must be smaller than 60.';
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
				that._context = that._canvas.getContext('2d');
			}
		};

		that.setContext = function (context) {
			if (!Framework.Util.isUndefined(context)) {
				that.context = null;
				that._canvas = null;
				that.context = context;
			} else {
				Framework.DebugInfo.Log.error('Game SetContext Error')
			}
		};

		that.getContext = function () {
			return that.context;
		};


		/**
		* 讓任何一個在網頁上的元件得以全螢幕, 一定要在有使用者可以觸發的事件內撰寫, 例如: 
		* {{#crossLink "Level/click:event"}}{{/crossLink}},
		* {{#crossLink "Level/mousedown:event"}}{{/crossLink}},
		* {{#crossLink "Level/mouseup:event"}}{{/crossLink}},
		* {{#crossLink "Level/mousemove:event"}}{{/crossLink}},
		* {{#crossLink "Level/touchstart:event"}}{{/crossLink}},
		* {{#crossLink "Level/touchmove:event"}}{{/crossLink}},
		* {{#crossLink "Level/keydown:event"}}{{/crossLink}},
		* {{#crossLink "Level/keyup:event"}}{{/crossLink}}
		* 否則會無法全螢幕
		* @method fullScreen
		* @param {Object} ele 要被全螢幕的DOM, 若不設定則為遊戲的CANVAS
		* @static
		* @example
		* 	Framework.Game.fullScreen();
		*/
		that.fullScreen = function(ele) {
			var ele = ele || that._canvas;			
			if (!ele.fullscreenElement &&    // alternative standard method
			  !ele.mozFullScreenElement && 
			  !ele.webkitFullscreenElement && 
			  !ele.msFullscreenElement ) {  // current working methods
				if (ele.requestFullscreen) {
				  ele.requestFullscreen();
				} else if (ele.msRequestFullscreen) {
				  ele.msRequestFullscreen();
				} else if (ele.mozRequestFullScreen) {
				  ele.mozRequestFullScreen();
				} else if (ele.webkitRequestFullscreen) {
				  ele.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
				//ele.style.width = '100%'//window.innerWidth;
				//ele.style.height = '100%'//window.innerHeight;			
			} 
		};

		/**
		* 退出全螢幕	
		* @method exitFullScreen
		* @static
		* @example
		* 	Framework.Game.exitFullScreen();
		*/
		that.exitFullScreen = function() {	
			if (document.exitFullscreen) {
			  document.exitFullscreen();
			} else if (document.msExitFullscreen) {
			  document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
			  document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
			  document.webkitExitFullscreen();
			}
		};

		return that;
	})();
	return Framework;
})(Framework || {});
