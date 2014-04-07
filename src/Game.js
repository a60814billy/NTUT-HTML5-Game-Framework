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
		that._runInstance = undefined;
        // game state
        that._levels = [];
        // current level
        that._currentLevel = undefined;

		that._context = null;

		that._ideaWidth = 16;
		that._ideaHeight = 9;
		that._widthRatio = 1;
		that._heightRatio = 1;

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

		that._mainContainer = document.createElement('div');
		that._mainContainer.style.backgroundColor = '#000';
		that._mainContainer.style.width = '100%';
		that._mainContainer.style.height = '100%';
		that._mainContainer.style.display = 'table';
		that._canvasContainer = document.createElement('div');				
		//that._canvasContainer.style.margin = '0px auto';
		that._canvasContainer.style.display = 'table-cell';
		that._canvasContainer.style.textAlign = 'center';
		that._canvasContainer.style.verticalAlign = 'middle';
		that._canvas = document.createElement('canvas');	
		that._canvas.style.backgroundColor = '#fff';		
		that._canvas.setAttribute('id', '__game_canvas__');
		that._canvas.width = 1600;
		that._canvas.height = 900;
		that._canvasContainer.appendChild(that._canvas);
		that._mainContainer.appendChild(that._canvasContainer);
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
          	//if(this._currentLevel.autoDelete){
                this._currentLevel.autodelete();
           // }
        };

        that.getCanvasWidth = function() {
        	return that._canvas.width;
        };

        that.getCanvasHeight = function() {
        	return that._canvas.height;
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
            that.pause();
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
            that.pause();
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
            that.pause();
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
            if (Framework.Util.isUndefined(that._currentLevel)){
                that._currentLevel = that._levels[0].level;
            }
            var self = that;

            if (!that._isInit) {
            	that.resizeEvent();
                document.body.appendChild(that._mainContainer);
                window.addEventListener("resize", that.resizeEvent, false);
            }

			that._tempDraw = self._currentLevel._draw;
			that._tempUpdate = self._currentLevel._update;
			that.initializeProgressResource();


			var runFunction = function() {
				self._isRun = true;
				self.pause();
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
			//
			
			Framework.TouchManager.setSubject(self._currentLevel);
			Framework.TouchManager.setTouchstartEvent(self._currentLevel.touchstart);
			Framework.TouchManager.setTouchendEvent(self._currentLevel.touchend);
			Framework.TouchManager.setTouchmoveEvent(self._currentLevel.touchmove);			

			Framework.MouseManager.setSubject(self._currentLevel);
			Framework.MouseManager.setClickEvent(self._currentLevel.click);
			Framework.MouseManager.setMousedownEvent(self._currentLevel.mousedown);
			Framework.MouseManager.setMouseUpEvent(self._currentLevel.mouseup);
			Framework.MouseManager.setMouseMoveEvent(self._currentLevel.mousemove);
			//Framework.MouseManager.setContextmenuEvent(self._currentLevel.contextmenu);

			Framework.KeyBoardManager.addSubject(self._currentLevel);
			Framework.KeyBoardManager.setKeyupEvent(self._currentLevel.keyup);
			Framework.KeyBoardManager.setKeydownEvent(self._currentLevel.keydown);
			
		};

		that.run = function() {	
			var self = that,	
				nowFunc = function() { return (new Date()).getTime(); },		
				updateTicks = 1000 / that._updateFPS,
				drawTicks = 1000 / that._drawFPS,
				previousUpdateTime = nowFunc(),
				previousDrawTime = nowFunc(),
				now = nowFunc();

			var nextGameTick = (new Date()).getTime(),
				nextGameDrawTick = (new Date()).getTime();
			var skipTicks = Math.round(1000 / that._updateFPS);

			var updateFunc = function() {	
				now = nowFunc();						
				while (now > nextGameTick) {
					//console.log('now: ' + now + ', nextGameTick: ' + nextGameTick + ', diff:' + (now-nextGameTick));	
					that._fpsAnalysis.update();
					// show FPS information
					if (that.fpsContext) {
						that.fpsContext.innerHTML = 'update FPS:' + that._fpsAnalysis.getUpdateFPS() + '<br />draw FPS:' + that._drawfpsAnalysis.getUpdateFPS();
					}							
					// run Game's update
					that.update();
					nextGameTick += skipTicks;
				}						
			};

			var drawFunc = function() {
				if (now > nextGameDrawTick) {
					that._context.clearRect(0, 0, that._canvas.width, that._canvas.height);	
					that.draw(that._context);
					that._drawfpsAnalysis.update();
					if (that.fpsContext) {
						that.fpsContext.innerHTML = 'update FPS:' + that._fpsAnalysis.getUpdateFPS() + '<br />draw FPS:' + that._drawfpsAnalysis.getUpdateFPS();
					}
					nextGameDrawTick += skipTicks;
				}
			};

			var gameLoopFunc = function() {				
				updateFunc();
				drawFunc();								
			}

			that.runInterval(gameLoopFunc);
			that._isRun = true;
		};
		
		that.runAnimationFrame = function (gameLoopFunc) {
			/*if(!Framework.Util.isUndefined(that._runInstance)) {
				that.stopAnimationFrame();
			}*/
			// dynamic product runnable function
			window.requestAnimationFrame = window.requestAnimationFrame || 
                        window.mozRequestAnimationFrame || 
                        window.webkitRequestAnimationFrame || 
                        window.msRequestAnimationFrame;
			var _run = function () {
				that._runInstance = requestAnimationFrame(_run);
				gameLoopFunc();
			};
			_run();
		};	/**/			

		that.runInterval = function (gameLoopFunc) {
			/*if(!Framework.Util.isUndefined(that._runInstance)) {
				that.stopInterval();
				that._runInstance = null;
			}*/
			// dynamic product runnable function
			var drawTicks = 1000 / that._drawFPS;
			var _run = gameLoopFunc/*function () {
					gameLoopFunc.call(this);
				};*/

			that._runInstance = setInterval(gameLoopFunc, drawTicks);
		};

		that.stopInterval = function() {
			clearInterval(that._runInstance);
		};

		that.stopAnimationFrame = function() {
			cancelAnimationFrame(that._runInstance);
		};
/**/
		that.pause = function () {
			if (that._isRun) {
				that.stopInterval();
				that._runInstance = null;
				that._isRun = false;
			}
		};

		that.resume = function() {
			if(!that._isRun) {
				that.run();
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
			that.pause();
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
			that.pause();
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
				that._canvasContainer.innerHTML = '';
				that._canvasContainer.appendChild(that._canvas);
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

		that.resizeEvent = function() {
			var base = 0,
				baseWidth = window.innerWidth / 16,
				baseHeight = window.innerHeight / 9,
				scaledWidth = 0,
				scaledHeight = 0;
			if(baseWidth < baseHeight) {
				base = baseWidth;
			} else {
				base = baseHeight;
			}

			scaledWidth = Math.round(base * 16);
			scaledHeight = Math.round(base * 9);
			that._widthRatio = scaledWidth / that._canvas.width;
			that._heightRatio = scaledHeight / that._canvas.height;		
			//that._canvasContainer.style.width = scaledWidth;
			//that._canvasContainer.style.height = scaledHeight;
			that._canvas.style.width = scaledWidth;
			that._canvas.style.height = scaledHeight;		
	
		};

		return that;
	})();
	return Framework;
})(Framework || {});
