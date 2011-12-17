define(['./vlog', './WS'], function(vlog, WS) {
  var fps = 50,
    loop_query = [],
    loop_clear_query = [],
    timeouts = {
      main_loop: null,
      fps_counter: null
    },
    actual_fps = 0; // real fps

  function loop() {
    WS.receive();

    for (var i = 0, _l = loop_clear_query.length; i < _l; i += 1) {
      if (typeof loop_clear_query[i] === 'function') {
        loop_clear_query[i]();
      }
    }
    for (var i = 0, _l = loop_query.length; i < _l; i += 1) {
      if (typeof loop_query[i] === 'function') {
        loop_query[i]();
      }
    }

    // TODO: use push()!
    WS.report();

    actual_fps += 1;
    timeouts.main_loop = setTimeout(loop, 1000 / fps);
  }

  function StartFPSCounter(sec) {
    vlog.log('FPS: ' + (actual_fps / sec));
    actual_fps = 0;
    timeouts.fps_counter = setTimeout(StartFPSCounter, 1000 * sec, sec);
  }

  /**
   * Возвращает номер функции в очереди.
   * Полезно при удалени из очереди
   */
  function pushQuery(func) {
    loop_query.push(func);
    return loop_query.length - 1;
  }

  function removeQuery(index) {
    loop_query[Number(index)] = null;
  }

  function pushClearQuery(func) {
    loop_clear_query.push(func);
    vlog.log('pushed to clear. type: ' + (typeof func));
    return loop_clear_query.length - 1;
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
      StartFPSCounter(5);
      startLoop();
    },
    stop: stopLoop,
    push: pushQuery,
    remove: removeQuery,
    pushClear: pushClearQuery,
    fps: function() { return fps; }
  }
});
