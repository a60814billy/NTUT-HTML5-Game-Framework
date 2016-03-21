var MyMenu = Framework.exClass(Framework.GameMainMenu , {
            //初始化loadingProgress需要用到的圖片
    initializeProgressResource: function() {
        this.loading = new Framework.Sprite(define.imagePath + 'loading.jpg');
        this.loading.position = {x: Framework.Game.getCanvasWidth() / 2 , y: Framework.Game.getCanvasHeight() / 2};

        //為了或得到this.loading這個Sprite的絕對位置, 故需要先計算一次(在Game Loop執行時, 則會自動計算, 但因為loadingProgress只支援draw故需要自行計算)                  
    },

    //在initialize時會觸發的事件
    loadingProgress: function(ctx, requestInfo) {
        //console.log(Framework.ResourceManager.getFinishedRequestPercent())
        this.loading.draw(ctx);
        ctx.font ='90px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(Math.round(requestInfo.percent) + '%' , ctx.canvas.width / 2 , ctx.canvas.height / 2 + 300);
    },

    load: function() {
        this.menu = new Framework.Sprite(define.imagePath + 'Title.png');
    },

    initialize: function() {


        //為了讓之後的位置較好操控, new出一個位於中心點且可以黏貼任何東西的容器
        //注意, Position都是用中心點
        this.menu.position = {
            x: Framework.Game.getCanvasWidth() / 2,
            y: Framework.Game.getCanvasHeight() / 2
        };
        this.menu.scale = 2;
        this.rootScene.attach(this.menu);

        this.rectPosition = { 
            x: Framework.Game.getCanvasWidth() / 2 - 130,
            y: Framework.Game.getCanvasHeight() / 2
        };
    },

    update:function(){     
        //this.rootScene.update();一定要在第一行
        this.rootScene.update(); 

        //目前的Framework, 當任何一個GameObject不做attach時, 則必須要自行update
    },

    draw: function(parentCtx) { 
        //this.rootScene.draw();一定要在第一行
        this.rootScene.draw(parentCtx);
        this.menu.draw(parentCtx);
        //this.rootScene.draw();
        //可支援畫各種單純的圖形和字
        parentCtx.font = '65pt bold';
        parentCtx.fillStyle = 'black';
        parentCtx.textBaseline = 'top';
        parentCtx.textAlign = 'center';
        parentCtx.fillText('Click To Start', this.rectPosition.x + 130, this.rectPosition.y, 260);
		this.ctx = parentCtx;
    },

    mouseup: function(e) {
    },

    mousedown: function(e) {
        //console.log為Browser提供的function, 可以在debugger的console內看到被印出的訊息                    
        // Framework.Game.goToNextLevel();
    },

    click:function(e){      
        Framework.Game.goToNextLevel();

    },

    mousemove: function(e) {  
		this.ctx.globalAlpha=0.8;
        this.ctx.fillStyle = 'black'; 
        this.ctx.fillRect(255, 40, 300, 40);  
        this.ctx.font = '30pt Algerian';
        this.ctx.globalAlpha=1;
        this.ctx.fillStyle = 'yellow';
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(e.x+", "+e.y, 255, 40);
    },

    mouseup: function(e) {
        this.isTouchArrow = false;
    },

    touchstart: function (e) {
        //為了要讓Mouse和Touch都有一樣的事件
        //又要減少Duplicated code, 故在Touch事件被觸發時, 去Trigger Mouse事件
        this.mousedown(e[0]);
    },

    touchend: function (e) {
        this.mouseup();
    },
    
    touchmove: function (e) {
        this.mousemove(e[0]);
    }
});