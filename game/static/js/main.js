// TODO: replace following with window.addEventListener('load', eventWindowLoaded, false);

window.addEventListener('DOMContentLoaded', function() {
    vLog.log('Hello');
}, false);

window.onload = function() {
/*
    var source = new EventSource('/stream');
    var uuid = '';

    source.addEventListener('uuid', function(e) {
        uuid = e.data;
        console.log('uuid: ' + uuid);
    });

    source.addEventListener('message', function(e) {
        console.log('message: ' + e.data);
    }, false);

    source.addEventListener('open', function(e) {
        console.log('SSE open');
    }, false);

    source.addEventListener('error', function(e) {
        $.post('/unsubscribe/' + uuid).done(function() {
            if (e.eventPhase == EventSource.CLOSED) {
                console.log('SSE close');
            }
        });
    }, false);
*/
    // initCanvas('canvasOne');
    CanvasBlackjack.init();
/*    CanvasBlackjack.renderField(); */
    window.onresize = CanvasBlackjack.center;
    CanvasBlackjack.center();

    var tank = new Tank(CanvasBlackjack.context(), function() {
        tank.place(70, 70);
        MainLoop.start();
    });
}

