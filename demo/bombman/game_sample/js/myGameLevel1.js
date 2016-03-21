var MyGame = Framework.Class(Framework.Level , {
    
    load: function() {
        this.map = new Map();
        this.map.load();
    },

    initialize: function() {
        
        this.map.init();
    },

    update: function() {     
        this.map.update();
    },

    draw:function(parentCtx){
        //this.rootScene.draw();
        //可支援畫各種單純的圖形和字
        this.map.draw(parentCtx);
        
    },

    keydown:function(e, list){
        
        Framework.DebugInfo.Log.warning(e.key);

        this.map.keydown(e, list);
        if(e.key === 'F11') {
            if(!this.isFullScreen) {
                Framework.Game.fullScreen();
                this.isFullScreen = true;
            } else {
                Framework.Game.exitFullScreen();
                this.isFullScreen = false;
            }
            
        }
    },

    keyup:function(e, list){
        
        this.map.keyup(e, list);
    },

    touchstart: function (e) {
        //為了要讓Mouse和Touch都有一樣的事件
        //又要減少Duplicated code, 故在Touch事件被觸發時, 去Trigger Mouse事件
        this.click(e[0]);
    },

    click: function (e) {  
        
    },
	
	mousemove: function(e) {        
		console.log(e.x+", "+e.y);
    },
});