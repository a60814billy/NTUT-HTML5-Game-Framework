Framework.Game.fps = 30;
Framework.Game.canvasWidth = 1600;
Framework.Game.canvasHeight = 900;
Framework.Game.isBackwardCompatiable = false;

//當有要加關卡時, 可以使用addNewLevel
//第一個被加進來的Level就是啟動點, 所以一開始遊戲就進入MyMenu
//Framework.Game.addNewLevel({myBox2D: new MyBox2D()});
Framework.Game.addNewLevel({menu: new MyMenu()});
Framework.Game.addNewLevel({level1: new MyGame()});
Framework.Game.addNewLevel({gameOver: new GameOver()});
Framework.Game.start();

