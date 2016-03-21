// QUnit.asyncTest( "Test Script", function( assert ) {
    // Framework.Replay.waitFor(123);
    // Framework.Replay.waitFor(3);
    // Framework.Replay.mouseClick(801,429);
    // Framework.Replay.waitFor(75);
    // Framework.Replay.keyDown('Right');
    // Framework.Replay.waitFor(7);
    // Framework.Replay.keyUp('Right');
    // Framework.Replay.waitFor(5);
    // Framework.Replay.keyDown('Right');
    // Framework.Replay.waitFor(7);
    // Framework.Replay.keyUp('Right');
    // Framework.Replay.waitFor(3);
    // Framework.Replay.keyDown('Right');
    // Framework.Replay.waitFor(7);
    // Framework.Replay.keyUp('Right');
    // Framework.Replay.waitFor(13);
    // Framework.Replay.keyDown('Space');
    // Framework.Replay.waitFor(7);
    // Framework.Replay.keyUp('Space');
    // Framework.Replay.waitFor(3);
    // Framework.Replay.keyDown('Left');
    // Framework.Replay.waitFor(7);
    // Framework.Replay.keyUp('Left');
    // Framework.Replay.waitFor(7);
    // Framework.Replay.keyDown('Left');
    // Framework.Replay.waitFor(7);
    // Framework.Replay.keyUp('Left');
    // Framework.Replay.waitFor(5);
    // Framework.Replay.keyDown('Left');
    // Framework.Replay.waitFor(9);
    // Framework.Replay.keyUp('Left');
    // Framework.Replay.waitFor(5);
    // Framework.Replay.keyDown('Left');
    // Framework.Replay.waitFor(7);
    // Framework.Replay.keyUp('Left');
	// replay.assertEqual("map.player1.bombPower",1);
// });
// QUnit.asyncTest( "Test Get Bomb Num Up", function( assert ) {

  // replay.goToLevel("level1");
  // GetBombNumUp();
  // replay.assertEqual("map.player1.maxBombNum",1);

// });

// QUnit.asyncTest( "Test Place Bomb Correct", function( assert ) {

  // replay.goToLevel("level1");
  // replay.assertEqual("map.player1.maxBombNum",1);
  // PlaceBomb();
  // replay.assertEqual("map.player1.bombNum",1);
  // Walk('Right',1);
  // PlaceBomb();
  // replay.assertEqual("map.player1.bombNum",1);
  // Walk('Right',2);
  // WaitAllBombExplore();
  // replay.assertEqual("map.player1.bombNum",0);
  // Walk('Left',3);
  // GetBombNumUp();
  // PlaceBomb();
  // replay.assertEqual("map.player1.bombNum",1);
  // Walk('Right',1);
  // PlaceBomb();
  // replay.assertEqual("map.player1.bombNum",2);
  // Walk('Right',1);
  // Walk('Up',1);
  // replay.assertEqual("map.player1.maxBombNum",2);
  // WaitAllBombExplore();
  // replay.assertEqual("map.player1.bombNum",0);

// });

// QUnit.asyncTest( "Test Score", function( assert ) {

  // replay.goToLevel("level1");
  // EatPowerUp();
  // replay.assertEqual("map.score._score",500);
  // Walk('Down',1);
  // Walk('Left',2);
  // GetBombNumUp();
  // replay.assertEqual("map.score._score",800);

// });

// QUnit.asyncTest( "Test Kill Monster", function( assert ) {

  // replay.goToLevel("level1");
  // replay.executeFunction("map.stopAllMonsterWalk()");
  // Walk('Down',1);
  // PlaceBomb();
  // Walk('Up',2);
  // WaitAllBombExplore();
  // Walk('Down',3);
  // PlaceBomb();
  // Walk('Up',2);
  // WaitAllBombExplore();
  // replay.assertEqual("map.monster[0].isdead",true);
  // replay.assertEqual("map.score._score",600);
// });

// QUnit.asyncTest( "Complete Test", function( assert ) {

  // replay.goToLevel("level1");
  // replay.executeFunction("map.stopAllMonsterWalk()");
  // Walk('Down',1);
  // PlaceBomb();
  // Walk('Up',2);
  // WaitAllBombExplore();
  // Walk('Down',3);
  // PlaceBomb();
  // Walk('Up',2);
  // WaitAllBombExplore();
  // replay.assertEqual("map.monster[0].isdead",true);
  // replay.assertEqual("map.score._score",600);
// });


// QUnit.asyncTest( "Complete Test", function( assert ) {

  // replay.goToLevel("level1");
  // replay.executeFunction("map.stopAllMonsterWalk()");
  // EatPowerUp();
  // Walk('Down',1);
  // Walk('Right',1);
  // PlaceBomb();
  // Walk('Left',3);
  // Walk('Down',1);
  // WaitAllBombExplore();
  // PlaceBomb();
  // Walk('Up',1);
  // Walk('Right',4);
  // WaitAllBombExplore();
  // PlaceBomb();
  // Walk('Left',4);
  // Walk('Down',1);
  // WaitAllBombExplore();
  // replay.assertEqual("map.monster[1].isdead",true);
  // PlaceBomb();
  // Walk('Up',1);
  // Walk('Right',9);
  // WaitAllBombExplore();
  // replay.assertEqual("map.monster[0].isdead",true);
  // PlaceBomb();
  // Walk('Left',1);
  // Walk('Down',1);
  // WaitAllBombExplore();
  // Walk('Up',1);
  // Walk('Right',2);
  // Walk('Down',1);
  // PlaceBomb();
  // Walk('Up',1);
  // Walk('Left',2);
  // Walk('Down',1);
  // WaitAllBombExplore();
  // replay.assertEqual("map.monster[3].isdead",true);
  // Walk('Up',1);
  // Walk('Right',2);
  // Walk('Up',1);
  // PlaceBomb();
  // Walk('Down',1);
  // Walk('Left',1);
  // WaitAllBombExplore();
  // Walk('Right',1);
  // Walk('Up',1);
  // PlaceBomb();
  // Walk('Down',1);
  // Walk('Left',1);
  // WaitAllBombExplore();
  // Walk('Right',1);
  // Walk('Up',1);
  // Walk('Right',4);
  // PlaceBomb();
  // Walk('Left',3);
  // Walk('Up',1);
  // WaitAllBombExplore();
  // replay.assertEqual("map.monster[2].isdead",true);
// });