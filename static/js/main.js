// TODO: replace following with window.addEventListener('load', eventWindowLoaded, false);

require(['./MainLoop', './vlog', './Tank', './ExtCanvas'], function(MainLoop, vlog, Tank, ExtCanvas) {
  window.addEventListener('DOMContentLoaded', function() {
    vlog.log('Hello');
  }, false);

  window.onload = function() {
    // initCanvas('canvasOne');
    ExtCanvas.init();
/*    ExtCanvas.renderField(); */
    window.onresize = ExtCanvas.center;
    ExtCanvas.center();

    var tank = new Tank(ExtCanvas.context(), { left: 37, top: 38, right: 40, down: 39 }, function() {
      tank.place(70, 70);
      // MainLoop.push(function() { vlog.log('x: ' + tank.pos.x + '; y: ' + tank.pos.y); });
      MainLoop.start();
    });
  }

  window.onfocus = function() {
    ExtCanvas.renderField([0, 0, 10, 10]);
  }
});


