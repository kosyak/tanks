define(['./vlog', './MainLoop'], function(vlog, MainLoop) {
  var callbacks = { 'sample': [ function() { console.log('test1') }, function() { console.log('test2') } ] },
    state = { 'keycode1': true, 'keycode2': false };

  function start() {
    document.onkeydown = function(event) {
      // vlog.log('keyboard down: ' + event.which);
      state[event.which] = true;
    };
    document.onkeyup = function(event) {
      // vlog.log('keyboard up: ' + event.which);
      state[event.which] = false;
    };
    MainLoop.pushClear(call);
  }

  function assign(keycode, callback) {
    vlog.log('keyboard event assign: ' + keycode);
    if (keycode && typeof callback === 'function') {
      callbacks[keycode] = callbacks[keycode] || [];
      callbacks[keycode].push(callback);
    }
  };

  function free(keycode) {
    state[keycode] = []
  };

  function force_down(keycode) {
    state[keycode] = true;
  };

  function force_up(keycode) {
    state[keycode] = false;
  };

  function call() {
    for (var key in state) {
      if (state[key] && callbacks[key] && callbacks[key].length) {
        for (var i = 0; i < callbacks[key].length; i += 1) {
          // vlog.log('keyboard call ' + key);
          callbacks[key][i](key);
        }
      }
    }
  };

  return {
    start: start,
    assign: assign,
    free: free,
    forceDown: force_down,
    forceUp: force_up,
    call: call
  }
});
