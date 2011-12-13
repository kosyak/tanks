// TODO: replace following with window.addEventListener('load', eventWindowLoaded, false);

window.addEventListener('DOMContentLoaded', function() {
    vLog.log('Hello');
}, false);

window.onload = function() {
    // initCanvas('canvasOne');
    CanvasBlackjack.init();
/*    CanvasBlackjack.renderField(); */
    window.onresize = CanvasBlackjack.center;
    CanvasBlackjack.center();

    var tank = new Tank(CanvasBlackjack.context(), { left: 37, top: 38, right: 40, down: 39 }, function() {
        tank.place(70, 70);
        // MainLoop.push(function() { vLog.log('collide: ' + Map.collide(tank)); });
        MainLoop.start();
    });
}

window.onfocus = function() {
    CanvasBlackjack.renderField([0, 0, 10, 10]);
}
