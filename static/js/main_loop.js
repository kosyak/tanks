var MainLoop = (function() {
    var fps = 60,
        loop_query = [],
        timeouts = {
            main_loop: null,
            fps_counter: null
        },
        actual_fps = 0; // real fps
    function loop() {
        for (var i = 0, _l = loop_query.length; i < _l; i += 1) {
            if (typeof loop_query[i] === 'function') {
                loop_query[i]();
            }
        }
        actual_fps += 1;
        timeouts.main_loop = setTimeout(loop, 1000 / fps);
    }
    function StartFPSCounter() {
        vLog.log('FPS: ' + actual_fps);
        actual_fps = 0;
        timeouts.fps_counter = setTimeout(StartFPSCounter, 1000);
    }
    function pushQuery(func) {
        loop_query.push(func);
    }
    function startLoop() {
        loop();
    }
    function stopLoop() {
        if (timeouts.main_loop !== null) {
            clearTimeout(timeouts.main_loop);
        }
    }
    return {
        start: function() {
            // StartFPSCounter();
            startLoop();
        },
        stop: stopLoop,
        push: pushQuery,
        fps: function() { return fps; }
    }
} ());
