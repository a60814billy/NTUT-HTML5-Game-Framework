//當有要加關卡時, 可以使用addNewLevel
Framework.Game.addNewLevel({menu: new MyMenu()});
Framework.Game.addNewLevel({level1: new MyGame()});

//讓Game開始運行
Framework.Game.start();