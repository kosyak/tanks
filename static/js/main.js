// TODO: replace following with window.addEventListener('load', eventWindowLoaded, false);

    /* <script src="static/js/vlog.js" type="text/javascript"></script>
    <script src="static/js/map.js" type="text/javascript"></script>
    <script src="static/js/main_loop.js" type="text/javascript"></script>
    <script src="static/js/keyboard.js" type="text/javascript"></script>
    <script src="static/js/canvas.js" type="text/javascript"></script>
    <script src="static/js/tank.js" type="text/javascript"></script>
    <script src="static/js/ws.js" type="text/javascript"></script>
    <script src="static/js/main.js" type="text/javascript"></script> */

require(["http://direct.kosov.eu:8080/socket.io/socket.io.js",
         "static/js/vlog.js",
         "static/js/map.js",
         "static/js/main_loop.js",
         "static/js/keyboard.js",
         "static/js/canvas.js",
         "static/js/tank.js",
         "static/js/ws.js"], function(someModule) {
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


