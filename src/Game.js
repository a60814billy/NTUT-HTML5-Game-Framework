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
		that._config = new Framework.Config();
		// gameloop fps
		that.fps = that._config.fps;
		that.canvasWidth = that._config.canvasWidth;
		that.canvasHeight = that._config.canvasHeight;
		that.isBackwardCompatiable = true;

		that._widthRatio = 1;
		that._heightRatio = 1;

		that._isRecording = false;
		that._isRecordMode = _isRecordMode;
		that._isTestMode = _isTestMode;
		that._isTestReady = false;
		that._isReplay = false;
		
		that.isContinue = false;
		that._isInit = false;
		// gameloop is running ?
		that._isRun = false;
		// show fps's div
		that._fpsContext = undefined;
		// FPS analysis object
		that._fpsAnalysis = new Framework.FpsAnalysis();
		that._drawfpsAnalysis = new Framework.FpsAnalysis();
		// for gameloop -
		that._runInstance = undefined;
        // game state
        that._levels = [];
        that._testScripts = [];
        // current level
        that._currentLevel = undefined;
		that._context = null;
		that._currentTestScript = undefined;
		that._currentReplay = undefined;

		that._ideaWidth = 16;
		that._ideaHeight = 9;
		that.timelist = [];
		that._record = new Framework.Record();


		that._tempUpdate = function() {};
		that._tempDraw = function(context) {};
		
		that.recordStart = function()
		{
			if(that._isRecordMode)
			{
				that._isRecording = true;
				document.getElementById("start_btn").setAttribute("enable", "false");
				document.getElementById("pause_btn").setAttribute("enable", "true");
				document.getElementById("stop_btn").setAttribute("enable", "true");
				document.getElementById("type_btn").setAttribute("enable", "true");
				document.getElementById("replay_btn").setAttribute("enable", "true");
				document.getElementById("variable_btn").setAttribute("enable", "false");
				that.btnEnable();
				that._record.start();
				that.resume();
			}
			if(that._isReplay){
				that.isContinue = true;
				that._isRecordMode = true;
				document.getElementById("start_btn").setAttribute("enable", "false");
				document.getElementById("pause_btn").setAttribute("enable", "true");
				document.getElementById("stop_btn").setAttribute("enable", "true");
				document.getElementById("type_btn").setAttribute("enable", "true");
				document.getElementById("replay_btn").setAttribute("enable", "true");
				document.getElementById("variable_btn").setAttribute("enable", "false");
				that.btnEnable();
			}
		};
		that.recordPause = function()
		{
			if(that._isRecordMode)
			{
				that._isRecording = false;
				document.getElementById("start_btn").setAttribute("enable", "true");
				document.getElementById("pause_btn").setAttribute("enable", "false");
				document.getElementById("stop_btn").setAttribute("enable", "true");
				document.getElementById("type_btn").setAttribute("enable", "true");
				document.getElementById("replay_btn").setAttribute("enable", "false");
				document.getElementById("variable_btn").setAttribute("enable", "true");
				that.btnEnable();
				that._record.pause();
				that.pause();
			}
		};
		that.recordStop = function()
		{
			if(that._isRecordMode)
			{
				that._isRecording = false;
				document.getElementById("start_btn").setAttribute("enable", "false");
				document.getElementById("pause_btn").setAttribute("enable", "false");
				document.getElementById("stop_btn").setAttribute("enable", "false");
				document.getElementById("type_btn").setAttribute("enable", "false");
				document.getElementById("replay_btn").setAttribute("enable", "true");
				document.getElementById("variable_btn").setAttribute("enable", "false");
				that.btnEnable();
				that._record.stop();
			}
		};
		that.recordInput = function()
		{
			var command = prompt("Please enter comment", "");
    
		    if (command != null) {
				that._record.inputCommand("//"+command);
		    }

		};
		that.recordReplay = function(){
			that._isReplay = true;
			that._teardown();
			that._currentLevel = null;
			that._isRecordMode = false;
			that._isTestMode = true;
			that._record.isRecording = false;
			that.isContinue = false;
			var replayScript = document.getElementById("record_div").innerText;
			document.getElementById("record_div").innerText = "";
			
			that.getReplayScript(replayScript);
			that._record.start();
			that.start();
			that._isRecording = true;
			if(document.getElementById("variable_list") != null){
				var div = document.getElementById("variable_list");
				div.parentNode.removeChild(div);
			}
			document.getElementById("start_btn").setAttribute("enable", "true");
			document.getElementById("pause_btn").setAttribute("enable", "false");
			document.getElementById("stop_btn").setAttribute("enable", "false");
			document.getElementById("type_btn").setAttribute("enable", "true");
			document.getElementById("replay_btn").setAttribute("enable", "false");
			document.getElementById("variable_btn").setAttribute("enable", "false");
			that.btnEnable();
		};
		that.getReplayScript = function(script){
			script = script.replace(/\n/g, "");
			var start = script.indexOf("{", 0)+1;
			var end = script.indexOf("}", 0);
			if(end === -1)
				end = script.length;
			var mainScript = script.substring(start, end);
			mainScript = mainScript.split(";");
			for(i=0; i<mainScript.length; i++){
				mainScript[i] = mainScript[i].replace("\u00a0\u00a0\u00a0\u00a0", "");
				// if(mainScript[i].indexOf("//", 0) === -1){
				if(mainScript[i].indexOf("replay.assertEqual")!=0){
					eval(mainScript[i]);
				}
				// }
			}
		};
		// that.recordContinue = function(){
			// that.isContinue = true;
			// document.getElementById("start_btn").setAttribute("enable", "false");
			// document.getElementById("pause_btn").setAttribute("enable", "true");
			// document.getElementById("stop_btn").setAttribute("enable", "true");
			// document.getElementById("type_btn").setAttribute("enable", "true");
			// document.getElementById("replay_btn").setAttribute("enable", "true");
			// document.getElementById("continue_btn").setAttribute("enable", "false");
			// document.getElementById("variable_btn").setAttribute("enable", "false");
			// that.btnEnable();
		// };
		that.showVariable = function(){
			var maindiv = document.getElementById("main");
			if(document.getElementById("variable_list") == null){
				var variableDiv = document.createElement('div');
				variableDiv.id = 'variable_list';
				variableDiv.style.cssText = "width:100%;height:30%;background-color:#d3e0e6;overflow:auto;font-size:20;";
				maindiv.appendChild(variableDiv);
			}
			else{
				var div = document.getElementById("variable_list");
				div.parentNode.removeChild(div);
			}
			listMember("Framework.Game._currentLevel", "&nbsp", "variable_list");
		};
		
		that.btnMouseOver = function(button){
			if(button.getAttribute('enable') === "true"){
				if(button.id == "start_btn")
					button.src = "game_sample/image/play_over.png";
				if(button.id == "pause_btn")
					button.src = "game_sample/image/pause_over.png";
				if(button.id == "stop_btn")
					button.src = "game_sample/image/stop_over.png";
				if(button.id == "type_btn")
					button.src = "game_sample/image/addComment_over.png";
				if(button.id == "replay_btn")
					button.src = "game_sample/image/replay_over.png";
				if(button.id == "variable_btn")
					button.src = "game_sample/image/variable_over.png";
			}
		};
		that.btnMouseOut = function(button){
			if(button.getAttribute('enable') === "true"){
				if(button.id == "start_btn")
					button.src = "game_sample/image/play.png";
				if(button.id == "pause_btn")
					button.src = "game_sample/image/pause.png";
				if(button.id == "stop_btn")
					button.src = "game_sample/image/stop.png";
				if(button.id == "type_btn")
					button.src = "game_sample/image/addComment.png";
				if(button.id == "replay_btn")
					button.src = "game_sample/image/replay.png";
				if(button.id == "variable_btn")
					button.src = "game_sample/image/variable.png";
			}
		};
		that.btnEnable = function(){
			if(document.getElementById("start_btn").getAttribute("enable") === "true")
				document.getElementById("start_btn").src = "game_sample/image/play.png";
			else
				document.getElementById("start_btn").src = "game_sample/image/play_disable.png";
			
			if(document.getElementById("pause_btn").getAttribute("enable") === "true")
				document.getElementById("pause_btn").src = "game_sample/image/pause.png";
			else
				document.getElementById("pause_btn").src = "game_sample/image/pause_disable.png";
			
			if(document.getElementById("stop_btn").getAttribute("enable") === "true")
				document.getElementById("stop_btn").src = "game_sample/image/stop.png";
			else
				document.getElementById("stop_btn").src = "game_sample/image/stop_disable.png";
			
			if(document.getElementById("type_btn").getAttribute("enable") === "true")
				document.getElementById("type_btn").src = "game_sample/image/addComment.png";
			else
				document.getElementById("type_btn").src = "game_sample/image/addComment_disable.png";
			
			if(document.getElementById("replay_btn").getAttribute("enable") === "true")
				document.getElementById("replay_btn").src = "game_sample/image/replay.png";
			else
				document.getElementById("replay_btn").src = "game_sample/image/replay_disable.png";
			
			if(document.getElementById("variable_btn").getAttribute("enable") === "true")
				document.getElementById("variable_btn").src = "game_sample/image/variable.png";
			else
				document.getElementById("variable_btn").src = "game_sample/image/variable_disable.png";
		};
		//Event Handler
		// mouse event
		that.click = function (e) {
            that._currentLevel.click(e);
            if(that._isRecording)
            {
            	that._record.click(e);
            }
		};
		that.mousedown = function (e) {
            that._currentLevel.mousedown(e);
            if(that._isRecording)
            {
            	that._record.mousedown(e);
            }
		};
		that.mouseup = function (e) {
            that._currentLevel.mouseup(e);
            if(that._isRecording)
            {
            	that._record.mouseup(e);
            }
		};
		that.mousemove = function (e) {
            that._currentLevel.mousemove(e);
			if(that._isRecording)
            {
            	that._record.mousemove(e);
            }
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
            if(that._isRecording)
            {
	            that._record.keydown(e);
	            //console.log("record down");
            }
		};
		that.keyup = function (e) {
            that._currentLevel.keyup(e);
            if(that._isRecording)
            {
            	that._record.keyup(e);
            }
		};
		that.keypress = function (e) {
            that._currentLevel.keypress(e);
            if(that._isRecording)
            {
            	that._record.keypress(e);
            }
		};

		that._mainContainer = document.createElement('div');
		if(that._isRecordMode){
			that._mainContainer.style.position = "relative";
			that._mainContainer.style.float = "left";
			that._mainContainer.style.width = '70%';
			that._mainContainer.style.height = '100%';
			that._mainContainer.style.display = 'table';
		}
		else if(that._isTestMode){
			that._mainContainer.style.position = "relative";
			that._mainContainer.style.float = "left";
			that._mainContainer.style.width = '70%';
			that._mainContainer.style.height = '100%';
		}
		else{
			that._mainContainer.style.width = '100%';
			that._mainContainer.style.height = '100%';
			that._mainContainer.style.display = 'table';
		}


		that._mainContainer.style.backgroundColor = '#000';
		that._canvasContainer = document.createElement('div');		
		that._canvasContainer.style.display = 'table-cell';
		that._canvasContainer.style.textAlign = 'center';
		that._canvasContainer.style.verticalAlign = 'middle';
		that._canvas = document.createElement('canvas');	
		that._canvas.style.backgroundColor = '#fff';		
		that._canvas.setAttribute('id', '__game_canvas__');
		that._canvas.width = that._config.canvasWidth;
		that._canvas.height = that._config.canvasHeight;
		that._canvasContainer.appendChild(that._canvas);
		that._mainContainer.appendChild(that._canvasContainer);
		that._context = that._canvas.getContext('2d');

		that.initializeProgressResource = function() {
            that._currentLevel._initializeProgressResource();
		};
		that.load = function() {
			that._currentLevel._load();
			if(that.isBackwardCompatiable)
			{
				that._currentLevel.initialize();
			}
		};
		that.loadingProgress = function(context) {
            that._currentLevel._loadingProgress(context, { request: Framework.ResourceManager.getRequestCount(), response: Framework.ResourceManager.getResponseCount(), percent: Framework.ResourceManager.getFinishedRequestPercent()});
            if(that.isBackwardCompatiable)
            {
            	that.initializeProgressResource();
            }
		};
		that.initialize = function () {
            that._currentLevel._initialize();
            that.initializeTestScript(that._currentLevel);
		};
		that.initializeTestScript = function(level){
			//that._testScripts
			var levelName = that._findLevelNameByLevel(level);
			for(var i= 0,l=that._testScripts.length;i<l;i++){
                if(that._testScripts[i].targetLevel === levelName ){
                    Framework.Replay.ready(that._testScripts[i]);
                    return;
                }
            }
		}
		that.update = function () {		
            that._currentLevel._update();
		};
		that.draw = function () {					
            that._currentLevel._draw();
		};

        that._teardown = function(){
          	//if(this._currentLevel.autoDelete){
                that._currentLevel.autodelete();
                that._isInit = false;
            //    that._allGameElement.length = 0;
           // }
        };

        that.stop = function()
        {
        	that.pause();
        	that._teardown();
        };

        that.getCanvasWidth = function() {
        	return that._canvas.width;
        };

        that.getCanvasHeight = function() {
        	return that._canvas.height;
        };

        that._findLevel = function(name){
            var result = Framework.Util.findValueByKey(that._levels,name);

        	if(result === null){
        		return null;
        	}
        	else{
				return result.level;
        	}
        };

        that._findScript = function(name){
        	var result = Framework.Util.findValueByKey(that._testScripts,name);

        	if(result === null){
        		return null;
        	}
        	else{
				return result.script;
        	}
        };

        that._findLevelNameByLevel = function(level){
			for(var i= 0,l=that._levels.length;i<l;i++){
	            if(that._levels[i].level === level ){
	                return that._levels[i].name;
	            }
        	}
        }

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

        that.addNewTestScript = function(levelName,scriptName,scriptInstance){

        	var levelName = levelName;
        	var scriptName = scriptName;
        	var scriptInstance = scriptInstance;


            	if(Framework.Util.isNull(that._findScript(scriptName))){
                        that._testScripts.push({targetLevel: levelName,name : scriptName , script : scriptInstance});
                    }else{
                        Framework.DebugInfo.Log.error('Game : Script名稱不能重複');
                        throw new Error('Game: already has same script name');
                    }
        }
        
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
            Framework.Replay.resetCycleCount();
            if(Framework.Util.isUndefined(that._currentLevel)){
                Framework.DebugInfo.Log.error('Game : 找不到關卡');
                throw new Error('Game : levelname not found.');
            }
            if(that._isRecordMode)
            {
            	that._record.inputCommand("// Change Level :" + levelname + ";");
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
            Framework.Replay.resetCycleCount();
            for(var i in that._levels){
                if(flag){
                    that._currentLevel = that._levels[i].level;
		            if(that._isRecordMode)
		            {
		            	var levelname = that._findLevelNameByLevel(that._currentLevel);
		            	that._record.inputCommand("// Change Level :" + levelname + ";");
		            }
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
            Framework.Replay.resetCycleCount();
            for(var i in that._levels){
                if(that._levels[i].level === that._currentLevel){
                    if(!Framework.Util.isUndefined(prev)){
                        that._currentLevel = prev;
			            if(that._isRecordMode)
			            {
			            	var levelname = that._findLevelNameByLevel(that._currentLevel);
			            	that._record.inputCommand("// Change Level To : " + levelname + ";");
			            }
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
			if(!that._isReplay){
				if(that._isTestMode && that._isTestReady === false)
				{
					return;
				}
			}
            if (Framework.Util.isUndefined(that._currentLevel) || Framework.Util.isNull(that._currentLevel)){
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
				self.initialize();
				//bind會產生一個同樣的function, 但this為指定的參數
				self.draw = self._tempDraw.bind(self._currentLevel);
				self.update = self._tempUpdate.bind(self._currentLevel);
				Framework.Replay.setGameReady();
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
				self.load();
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
			Framework.MouseManager.setClickEvent(self.click);
			Framework.MouseManager.setMousedownEvent(self.mousedown);
			Framework.MouseManager.setMouseUpEvent(self.mouseup);
			Framework.MouseManager.setMouseMoveEvent(self._currentLevel.mousemove);
			//Framework.MouseManager.setContextmenuEvent(self._currentLevel.contextmenu);

			Framework.KeyBoardManager.setSubject(self._currentLevel);
			Framework.KeyBoardManager.setKeyupEvent(self.keyup);
			Framework.KeyBoardManager.setKeydownEvent(self.keydown);
			
		};

		that.run = function() {	
			var self = that,	
				nowFunc = function() { return (new Date()).getTime(); },		
				updateTicks = 1000 / that.fps,
				drawTicks = 1000 / that.fps,
				previousUpdateTime = nowFunc(),
				previousDrawTime = previousUpdateTime,
				now = previousDrawTime;

			var nextGameTick = now,
				nextGameDrawTick = now;
			that.skipTicks = Math.round(1000 / that.fps);

			var updateFunc = function() {	
				now = nowFunc();						
				if (now > nextGameTick) {
					//console.log('now: ' + now + ', nextGameTick: ' + nextGameTick + ', diff:' + (now-nextGameTick));	
					that._fpsAnalysis.update();
					// show FPS information
					if (that.fpsContext) {
						that.fpsContext.innerHTML = 'update FPS:' + that._fpsAnalysis.getUpdateFPS() + '<br />draw FPS:' + that._drawfpsAnalysis.getUpdateFPS();
					}							
					// run Game's update
					that.update();	
					
		            if(that._isRecording)
		            {
		            	that._record.update();
		            	//console.log("record update")
		            }
					Framework.Replay.update();
					nextGameTick += that.skipTicks;
				}						
			};

			var drawFunc = function() {
				if (now >= nextGameDrawTick) {					
					that.draw(that._context);
					that._drawfpsAnalysis.update();
					if (that.fpsContext) {
						that.fpsContext.innerHTML = 'update FPS:' + that._fpsAnalysis.getUpdateFPS() + '<br />draw FPS:' + that._drawfpsAnalysis.getUpdateFPS();
					}
					nextGameDrawTick += that.skipTicks;
				}
			};

			var gameLoopFunc = function() {

                var preDraw = Date.now();
				updateFunc();
				drawFunc();		

                var drawTime = Date.now() - preDraw;
                if(drawTime > 5)
                {
                	that.timelist.push(drawTime);
            	}
                if(that.timelist.length >= 30)
                {
                    var average = that.countAverage(that.timelist);
                    that.timelist = [];
                    //console.log("game loop time average " + average);
                }						
			}

			that._isRun = true;
			that.runAnimationFrame(gameLoopFunc);
		};

        that.countAverage = function(list){
                var sum = 0;
                for(var i=0;i<list.length;i++){
                    sum += list[i];
                }
                return sum / list.length;
            };

		that.stopInterval = function() {
			clearInterval(that._runInstance);
		};

		that.stopAnimationFrame = function() {
			cancelAnimationFrame(that._runInstance);
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
				gameLoopFunc();
				if(that._isRun){
					that._runInstance = requestAnimationFrame(_run);
				}
			};
			_run();
			that.stopLoop = that.stopAnimationFrame;
		};	/**/			

		that.runInterval = function (gameLoopFunc) {
			/*if(!Framework.Util.isUndefined(that._runInstance)) {
				that.stopInterval();
				that._runInstance = null;
			}*/
			// dynamic product runnable function
			var drawTicks = 1000 / that.fps;
			var _run = gameLoopFunc/*function () {
					gameLoopFunc.call(this);
				};*/

			that._runInstance = setInterval(gameLoopFunc, drawTicks);
			that.stopLoop = that.stopInterval;
		};

		that.stopLoop = that.stopAnimationFrame;

		that.pause = function () {
			if (that._isRun) {
				that.stopLoop();
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
			that.skipTicks = Math.round(1000 / that.fps);
			that.fps = fps;
			that.pause();
			that.run();
		};

		that.getUpdateFPS = function () {
			return that.fps;
		};

		that.setDrawFPS = function (fps) {
			if (fps > 60) {
				Framework.DebugInfo.Log.warring('FPS must be smaller than 60.');
				throw 'FPS must be smaller than 60.';
				fps = 60;
			}
			that.fps = fps;
			that.pause();
			that.run();
		};

		that.getDrawFPS = function () {
			return that.fps;
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
				baseWidth = window.innerWidth / that._ideaWidth,
				baseHeight = window.innerHeight / that._ideaHeight,
				scaledWidth = 0,
				scaledHeight = 0;
			if(that._isTestMode || that._isRecordMode)
			{
				baseWidth = window.innerWidth * 0.7 / that._ideaWidth;
				baseHeight = window.innerHeight * 0.7 / that._ideaHeight;
			}
			if(baseWidth < baseHeight) {
				base = baseWidth;
			} else {
				base = baseHeight;
			}

			scaledWidth = Math.round(base * that._ideaWidth);
			scaledHeight = Math.round(base * that._ideaHeight);
			that._widthRatio = scaledWidth / that._canvas.width;
			that._heightRatio = scaledHeight / that._canvas.height;		
			//that._canvasContainer.style.width = scaledWidth;
			//that._canvasContainer.style.height = scaledHeight;
			that._canvas.style.width = scaledWidth;
			that._canvas.style.height = scaledHeight;		
	
		};

		that._pushGameObj = function(ele) {
			that._currentLevel._allGameElement.push(ele);
		};

		that._showAllElement = function() {
			that._currentLevel._showAllElement();
		};

		return that;
	})();

	return Framework;
})(Framework || {});

listMember = function(main, space, divId) {
	if(document.getElementById(divId+"_check")){
		if(document.getElementById(divId+"_check").src.match("game_sample/image/arrow_over.png")){
			document.getElementById(divId+"_check").src = "game_sample/image/arrow.png";
		}else{
			document.getElementById(divId+"_check").src = "game_sample/image/arrow_over.png";
		}
	}
	var div = document.getElementById(divId);
	var length = div.childNodes.length;
	if(length > 4){
		for(var i=4; i<length; i++){
			div.removeChild(div.childNodes[4]);
		}
	}
	else{
		for(key in eval(main)){
			//not function
			try{
				if(eval(main)[key].toString().indexOf("function", 0) === -1){
					if(key != "rootScene" && key != "autoDelete" && key != "_firstDraw" && key != "_allGameElement"){
						var varDiv = document.createElement("div");
						varDiv.id = key;
						varDiv.setAttribute("vertical-align","baseline");
						var checkBox = document.createElement("img");
						checkBox.setAttribute("src","game_sample/image/arrow.png");
						checkBox.setAttribute("width","5%");
						checkBox.setAttribute("id", key+"_check");
						var func = 'listMember("'+main.toString()+'.'+ key.toString() +'", "'+space+"&nbsp&nbsp&nbsp"+'", "'+ key +'")';
						checkBox.setAttribute("onclick", func);
						varDiv.innerHTML += space;
						varDiv.appendChild(checkBox);
						varDiv.innerHTML += key +"&nbsp&nbsp&nbsp";
						if(!isNaN(eval(main)[key])){
							var btn = document.createElement("input");
							btn.setAttribute("type","button");
							btn.value = "Assert";
							var func = 'addAssertion("'+main.toString()+'.'+ key.toString()+'","'+eval(main)[key]+'")'
							btn.setAttribute("onclick", func);
							varDiv.appendChild(btn);
						}
						varDiv.innerHTML += "<br>";
						div.appendChild(varDiv);
						// console.log(key + ": " + eval(main)[key] + "\n");
					}
				}
			}catch(e){
			
			}
		}
		space += "&nbsp&nbsp&nbsp";
	}
};

addAssertion = function(assertTarget, assertValue){
	// var s = assertTarget.indexOf("Framework.Game._currentLevel.")
	assertTarget = assertTarget.substring(29, assertTarget.length);
	var recordDiv = document.getElementById("record_div");
	document.getElementById("record_div").innerHTML += '<p>&nbsp;&nbsp;&nbsp;&nbsp;replay.assertEqual("'+assertTarget+'", '+assertValue+');</p>';
};
