// TODO: replace following with window.addEventListener('load', eventWindowLoaded, false);

require(['./MainLoop', './vlog', './Tank', './Map'], function(MainLoop, vlog, Tank, Map) {
  window.addEventListener('DOMContentLoaded', function() {
    vlog.log('Hello');
  }, false);

  window.onload = function() {
    // initCanvas('canvasOne');
    Map.init(function() {
      window.onresize = Map.center;
      Map.center();

      var tank = new Tank(Map.context(), { left: 37, top: 38, right: 40, down: 39 }, function() {
        tank.place(70, 70);
        // MainLoop.push(function() { vlog.log('x: ' + tank.pos.x + '; y: ' + tank.pos.y); });
        MainLoop.start();
      });
    });
  }

  window.onfocus = function() {
    Map.renderField([0, 0, 10, 10]);
  }
});


