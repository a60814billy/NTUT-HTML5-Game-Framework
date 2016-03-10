
var replay = Framework.Replay;
QUnit.module( "AngryBird Test", {
    setup: function()
    {
      replay.start();
    },
    teardown: function()
    {
      replay.stop();
    }
});
QUnit.asyncTest( "Click Move", function( assert ) {
    Framework.Replay.goToLevel("myBox2D");
    Framework.Replay.waitFor(200);
    Framework.Replay.waitFor(7);
    Framework.Replay.mouseClick(173,280);
    Framework.Replay.waitFor(20);
	replay.assertEqual("angryBird.component.position.x",172);
	Framework.Replay.waitFor(200);
});

QUnit.asyncTest( "Pass accelerator", function( assert ) {
    Framework.Replay.goToLevel("myBox2D");
    Framework.Replay.waitFor(246);
    Framework.Replay.waitFor(5);
    Framework.Replay.mouseClick(527,303);
	Framework.Replay.waitFor(20);
	replay.assertEqual("angryBird.component.body.m_linearVelocity.x",15, 1);
	Framework.Replay.waitFor(200);
});
QUnit.asyncTest( "Collide house", function( assert ) {
    Framework.Replay.goToLevel("myBox2D");
    Framework.Replay.waitFor(225);
    Framework.Replay.waitFor(9);
    Framework.Replay.mouseClick(880,448);
	Framework.Replay.waitFor(20);
	replay.assertEqual("angryBird.component.position.x",560);
	Framework.Replay.waitFor(200);
});

