// TODO: replace following with window.addEventListener('load', eventWindowLoaded, false);

require(['./MainLoop', './vlog', './Tank', './Map', './WS', './Keyboard'], function(MainLoop, vlog, Tank, Map, WS, Keyboard) {
  window.addEventListener('DOMContentLoaded', function() {
    vlog.log('Hello');
  }, false);

  window.onload = function() {
    // initCanvas('canvasOne');
    Map.init(function() {
      var tank;
      MainLoop.start();
      window.onresize = Map.center;
      Map.center();
      WS.start(function(uuid) {
        tank = new Tank({
          id: uuid,
          keys: {
            left: 37,
            top: 38,
            right: 40,
            down: 39,
            shoot: 32
          }
        }, function() {
          tank.placeCell(2, 5);
          // MainLoop.push(function() { vlog.log('x: ' + tank.pos.x + '; y: ' + tank.pos.y); });
        });
      });
      Keyboard.start();

    });
  }

  window.onfocus = function() {
    Map.renderField([0, 0, 10, 10]);
  }
});


