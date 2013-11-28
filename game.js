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
        this._fps = 60;
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

        this.initialize = function () {
            framework.log.info("game init non-override");
        };
        this.update = function () {
            //log("game update non-override");
        };
        this.draw = function () {
            //log("game draw non-override");
        };

        this.start = function () {
            this.initialize();


            this.run();
            this._isRun = true;
        };


        this.run = function () {
            // dynamic product runnable function
            this._run = (function (that) {
                // local variable for game loop use
                var nextGameTick = (new Date()).getTime();
                var skipTicks = 1000 / that.getFPS();
                return function () {
                    while ((new Date().getTime() > nextGameTick)) {
                        // update FPS counter
                        that._fpsAnalysis.update();
                        // show FPS information
                        if (that.fpsContext) that.fpsContext.innerHTML = "update FPS:" + that._fpsAnalysis.getFPS() + "<br />draw FPS:" + that._drawfpsAnalysis.getFPS();
                        // run Game's update
                        that.update();
                        // setup next run update time
                        nextGameTick += skipTicks;
                    }
                    // run Game's draw
                    that.draw(that.context);
                    that._drawfpsAnalysis.update();
                }
            })(this);
            //window.requestAnimationFrame(this._run);
            this._runInstance = setInterval(this._run, 1000 / 60);
            //this._run();
        };

        // propetity
        this.setFPS = function (fps) {
            this._fps = fps;
            if (this._isRun) {
                clearInterval(this._runInstance);
                this.run();
            }
        };

        this.getFPS = function () {
            return this._fps;
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
