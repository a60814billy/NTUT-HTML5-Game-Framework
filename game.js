// By Raccoon
// include namespace
var framework = (function (framework) {
    framework.game = function () {
        // ensure forget use new keyword to call this function
        // as work as use new keyword.
        if (!(this instanceof arguments.callee)) return new arguments.callee();

        // gameloop is running ?
        this._isRun = false;
        // gameloop fps
        this._updateFPS = 60;
	    this._drawFPS = 60;
        // show fps's div
        this._fpsContext = null;
        // FPS analysis object
        this._fpsAnalysis = new framework.fpsAnalysis();
        this._drawfpsAnalysis = new framework.fpsAnalysis();
        // for gameloop -
        this._runInstance = null;

        // defined default game screen (canvas object)
        this._convas = document.createElement("canvas");
        this._convas.setAttribute("id", "__game_canvas__");
        this._context = this._convas.getContext("2d");

        this.initialize = function () {};
        this.update = function () {};
        this.draw = function () {};

        this.start = function () {
            this.initialize();
	        if(!this._isRun){
		        this.run();
	        }
        };

        this.run = function () {
            // dynamic product runnable function
            this._run = (function (that) {
                // local variable for game loop use
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
                    that.draw(that.context);
                    that._drawfpsAnalysis.update();
	                if (that.fpsContext) that.fpsContext.innerHTML = "update FPS:" + that._fpsAnalysis.getUpdateFPS() + "<br />draw FPS:" + that._drawfpsAnalysis.getUpdateFPS();
                }
            })(this);
            this._runInstance = setInterval(this._run, 1000 / this._drawFPS);
	        this._isRun = true;
        };

	    this.stop = function(){
		    if(this._isRun){
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

	    this.setDrawFPS = function(fps){
		    if(fps > 60){
				framework.DebugInfo.log.warring("FPS must more than 60");
			    fps = 60;
		    }
		    this._drawFPS = fps;
		    this.stop();
		    this.run();
	    };

	    this.getDrawFPS = function(){
		    return this._drawFPS;
	    };

        this.setContext = function (context) {
            if (context) {
                this.context = null;
                this._canvas = null;
                this.context = context;
            } else {
                console.log("setContext error!");
            }
        };

        this.getContext = function () {
            return this.context;
        }
    };
    return framework;
})(framework || {});
