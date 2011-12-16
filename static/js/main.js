// TODO: replace following with window.addEventListener('load', eventWindowLoaded, false);

    /* <script src="static/js/vlog.js" type="text/javascript"></script>
    <script src="static/js/map.js" type="text/javascript"></script>
    <script src="static/js/main_loop.js" type="text/javascript"></script>
    <script src="static/js/keyboard.js" type="text/javascript"></script>
    <script src="static/js/canvas.js" type="text/javascript"></script>
    <script src="static/js/tank.js" type="text/javascript"></script>
    <script src="static/js/ws.js" type="text/javascript"></script>
    <script src="static/js/main.js" type="text/javascript"></script> */

require(["vLog.js", "map.js", "main_loop.js", "keyboard.js", "canvas.js", "tank.js", "ws.js"], function(someModule) {
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
            // MainLoop.push(function() { vLog.log('x: ' + tank.pos.x + '; y: ' + tank.pos.y); });
            MainLoop.start();
        });
    }

    window.onfocus = function() {
        CanvasBlackjack.renderField([0, 0, 10, 10]);
    }
});


