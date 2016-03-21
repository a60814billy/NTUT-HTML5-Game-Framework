var Map = function()
{

    this.load = function(){

        this.score = new Score();
        this.score.position = {x:1000,y:0};
        this.mapFloor = new Framework.Sprite(define.imagePath + 'floor2.png');
        this.mapFloor.scale = 2;
        this.mapWall = new Framework.Sprite(define.imagePath + 'treeStone.png');
        this.mapWall.scale = 2;
        var mapBoxPic = new Framework.Sprite(define.imagePath + 'box.png');
        var bombPic  = new Framework.Sprite(define.imagePath + 'bomb.png');
        var bombPic  = new Framework.Sprite(define.imagePath + 'explore.png');
        this.increaseBombNum  = new Framework.Sprite(define.imagePath + 'increaseBombNum.png');
        this.increaseBombNum.scale = 1.5;
        this.increaseBombPower  = new Framework.Sprite(define.imagePath + 'increaseBombPower.png');
        this.increaseBombPower.scale = 1.5;
        this.player1 = new BombMan(define.imagePath + 'player1.png', {down: {from: 0, to: 2}, left: {from:3, to: 5}, right: {from: 6, to: 8}, up: {from: 9, to: 11}});
        this.player1.position = {x:4, y:4};

        this.monster = [];
        for(var i=0;i<4;i++)
        {
            this.monster[i] = new Monster(define.imagePath + 'monster.png',this, {down: {from: 0, to: 2}, left: {from:3, to: 5}, right: {from: 6, to: 8}, up: {from: 9, to: 11}});
        }
        this.monster[0].position = {x:4, y:7};
        this.monster[1].position = {x:10, y:4};
        this.monster[2].position = {x:18, y:1};
        this.monster[3].position = {x:14, y:6};
    }

    this.init = function()
    {
        this.player1.StepMovedCallBack.push(this.playerMovedHandler);
        this.constants = new Constants();
        this.mapArray = [];
        this.boxArray = [];
        this.bombArray = [];
        this.itemArray = [];
        this.tileArray = [];
        this.exploreArray = [];
    	//0 空地  1牆壁  2空木箱  3增加炸彈木箱  4增加威力木箱  -1增加炸彈數  -2增加炸彈power
    	this.mapArray.push([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]); //1
    	this.mapArray.push([1,2,3,1,0,2,3,0,0,1,2,2,1,3,2,2,1,1,0,4,2,1]); //2
    	this.mapArray.push([1,4,2,0,2,1,2,1,0,2,3,0,2,0,1,0,1,1,0,1,1,1]); //3
    	this.mapArray.push([1,0,1,1,0,1,4,1,1,2,1,1,0,1,2,2,2,0,0,0,4,1]); //4
    	this.mapArray.push([1,2,3,0,0,0,0,2,0,2,0,0,0,0,2,1,1,2,1,2,0,1]); //5
    	this.mapArray.push([1,1,4,1,0,1,2,1,0,1,4,1,0,1,0,2,1,4,1,0,1,1]); //6
    	this.mapArray.push([1,4,0,0,2,1,0,0,0,1,2,2,2,0,0,1,2,0,0,4,0,1]); //7
    	this.mapArray.push([1,0,1,1,0,1,0,1,1,3,1,2,1,1,0,2,2,2,0,1,0,1]); //8
    	this.mapArray.push([1,0,3,0,0,2,4,2,0,0,2,0,0,1,1,2,1,1,0,3,0,1]); //9
    	this.mapArray.push([1,1,0,1,0,1,3,1,2,1,0,1,0,1,0,0,0,1,1,4,1,1]); //10
    	this.mapArray.push([1,1,4,1,0,1,0,2,0,4,2,1,0,1,1,2,0,3,2,0,0,1]); //11
    	this.mapArray.push([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]); //12

        for(var i=0; i<this.mapArray.length; i++){
            var line = this.mapArray[i];
            for(var j=0; j<line.length; j++){
                var tile = new MapTile();
                tile.tileType = 0;
                tile.position = {x:j,y:i}
                if(line[j] === 2){
                    var box = new Box(this.constants.ItemEnum.NONE);
                    box.position = {x:j, y:i};
                    this.boxArray.push(box);
                }else if(line[j] === 3){
                    var box = new Box(this.constants.ItemEnum.INCREASE_BOMB);
                    box.position = {x:j, y:i};
                    this.boxArray.push(box);
                }else if(line[j] === 4){
                    var box = new Box(this.constants.ItemEnum.INCREASE_POWER);
                    box.position = {x:j, y:i};
                    this.boxArray.push(box);
                }else
                {
                    tile.tileType = line[j];
                }
                this.tileArray.push(tile);
            }
        }
	};

    this.playerMovedHandler = function(player){
        var constants = new Constants();
        var item = m_map.mapArray[player.position.y][player.position.x];
        if(item === constants.ItemEnum.INCREASE_BOMB){
            player.increaseBombNum();
            m_map.mapArray[player.position.y][player.position.x] = 0;
            m_map.tileArray[player.position.y*22+player.position.x].tileType = 0;
            m_map.score.addScore(200);
        }else if(item === constants.ItemEnum.INCREASE_POWER){
            player.increaseBombPower();
            m_map.mapArray[player.position.y][player.position.x] = 0;
            m_map.tileArray[player.position.y*22+player.position.x].tileType = 0;
            m_map.score.addScore(200);
        }
    }

    this.exploreEndHandler = function(explore){
        var index = m_map.exploreArray.indexOf(explore);
        m_map.exploreArray.splice(index,1);
        m_map.draw(Framework.Game._context);
    }

	this.update = function()
	{
        for(var i=0; i<this.boxArray.length; i++)
        {
            this.boxArray[i].update();
        }
        for(var i=0; i<this.bombArray.length; i++)
        {
            this.bombArray[i].update();
        }
        for(var i=0; i<this.exploreArray.length; i++)
        {
            this.exploreArray[i].update();
        }
        this.player1.update();
        for(var i=0;i<this.monster.length;i++)
        {
            this.monster[i].update();
            if(this.monster[i].isDead == false && this.monster[i].position.x == this.player1.position.x && this.monster[i].position.y == this.player1.position.y)
            {
                this.player1.die();
            }
        }
	}
	this.draw = function(ctx) {
		// for(var i=0; i<this.mapArray.length; i++){
		// 	var line = this.mapArray[i];
		// 	for(var j=0; j<line.length; j++){
		// 		this.mapFloor.position = {x: j * 64, y: i * 64};
		// 		this.mapFloor.draw(ctx);
  //               if(line[j] === 1){
  //                   this.mapWall.position = {x: j * 64, y: i * 64};
  //                   this.mapWall.draw(ctx);
  //               }else if(line[j] === -1){
  //                   this.increaseBombNum.position = {x: j * 64, y: i * 64};
  //                   this.increaseBombNum.draw(ctx);
  //               }else if(line[j] === -2){
  //                   this.increaseBombPower.position = {x: j * 64, y: i * 64};
  //                   this.increaseBombPower.draw(ctx);
  //               }
		// 	}
		// }


        for(var i=0; i<this.tileArray.length; i++)
        {
            this.tileArray[i].draw(ctx);
        }

        for(var i=0; i<this.boxArray.length; i++)
        {
            this.boxArray[i].draw(ctx);
        }
        for(var i=0; i<this.bombArray.length; i++)
        {
            this.bombArray[i].draw(ctx);
        }
        for(var i=0; i<this.exploreArray.length; i++)
        {
            this.exploreArray[i].draw(ctx);
        }
        for(var i=0;i<this.monster.length;i++)
        {
            this.monster[i].draw(ctx);
        }
        this.player1.draw(ctx);
        this.score.draw(ctx);
	}	

    var m_map = this;
    this.bombExploredHandler = function(exploredArray, bomb){
        var index = m_map.bombArray.indexOf(bomb);
        m_map.bombArray.splice(index,1);
        m_map.mapArray[bomb.position.y][bomb.position.x] = 0;
        for(var i=0; i<exploredArray.length; i++){
            for(var j=0;j<exploredArray[i].length;j++)
            {
                var explorePos = exploredArray[i][j];
                var hasExploreBox = false;
                if(explorePos.x>0 && explorePos.y>0 && explorePos.y<m_map.mapArray.length && explorePos.x<m_map.mapArray[0].length){
                    if(m_map.mapArray[explorePos.y][explorePos.x]<0){
                        //item
                    }else if(m_map.mapArray[explorePos.y][explorePos.x] == 1)
                    {
                        //wall
                        break;
                    }else if(m_map.mapArray[explorePos.y][explorePos.x] >= 2){
                        //box
                        m_map.checkBoxExplore(explorePos);
                        hasExploreBox = true;
                    }

                    if(m_map.mapArray[explorePos.y][explorePos.x] != 1){
                        var explore = new Explore();
                        explore.position = explorePos;
                        explore.ExploredEndCallBack.push(m_map.exploreEndHandler);
                        m_map.exploreArray.push(explore);
                        if(hasExploreBox)
                        {
                            break;
                        }
                    }
                    if(explorePos.x === m_map.player1.position.x && explorePos.y === m_map.player1.position.y){
                        m_map.player1.die();
                    }
                    for(var k=0;k<m_map.monster.length;k++)
                    {
                        if(explorePos.x === m_map.monster[k].position.x && explorePos.y === m_map.monster[k].position.y){
                            m_map.monster[k].die();
                            m_map.score.addScore(500);
                        }
                    }
                }
            }
        }
    }

    this.checkBoxExplore = function(explorePos)
    {
        for(var j=0; j<m_map.boxArray.length; j++){
            if(m_map.boxArray[j] != undefined){
                var boxPosition = m_map.boxArray[j].position;
                if(boxPosition.x === explorePos.x && boxPosition.y === explorePos.y){
                    m_map.boxArray[j].explored();
                    m_map.mapArray[explorePos.y][explorePos.x] = m_map.boxArray[j].item;
                    m_map.tileArray[explorePos.y*22+explorePos.x].tileType = m_map.boxArray[j].item;
                    m_map.boxArray.splice(j,1);
                    m_map.score.addScore(100);
                }
            }
        }
    }

    this.keydown = function(e, list){
        var playerPosition = this.player1.position;
        if(e.key === 'Down') {
            if(this.checkIsWalkAble(playerPosition.x,playerPosition.y+1)){
                this.player1.walk({x:0,y:1});
            }
        }

        if(e.key === 'Left') {
            if(this.checkIsWalkAble(playerPosition.x-1,playerPosition.y)){
                this.player1.walk({x:-1,y:0});
            }
        }

        if(e.key === 'Right') {
            if(this.checkIsWalkAble(playerPosition.x+1,playerPosition.y)){
                this.player1.walk({x:1,y:0});
            }
        }

        if(e.key === 'Up') {
            if(this.checkIsWalkAble(playerPosition.x,playerPosition.y-1)){
                this.player1.walk({x:0,y:-1});
            }
        }

        if(e.key === 'Space'){
            var bomb = this.player1.placeBomb();
            if(!Framework.Util.isNull(bomb))
            {
                bomb.ExploredCallBack.push(Framework.Game._currentLevel.map.bombExploredHandler);
                this.bombArray.push(bomb);
                var bombPosition = bomb.position;
                this.mapArray[bombPosition.y][bombPosition.x] = 3;
            }
        }
    }

    this.stopAllMonsterWalk = function()
    {
        for(var i=0;i<this.monster.length;i++)
        {
            this.monster[i].stopWalk();
        }
    }

    this.checkIsWalkAble = function(x,y){
        if(x < 0 || x > this.mapArray[0].length){ return false; }
        if(y < 0 || y > this.mapArray.length){ return false; }

        if(this.mapArray[y][x] > 0){ return false; }
        else{ return true;}
    }

    this.keyup = function(e, list){
        if(e.key === 'Down' || e.key === 'Up' || e.key === 'Left' || e.key === 'Right') {
            this.player1.walkEnd();
        }
    }
}