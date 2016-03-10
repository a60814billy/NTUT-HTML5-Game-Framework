
var replay = Framework.Replay;
QUnit.module( "Bombman Test", {
    setup: function()
    {
      replay.start();
    },
    teardown: function()
    {
      replay.stop();
    }
});

QUnit.asyncTest( "Test Click Menu", function( assert ) {


});