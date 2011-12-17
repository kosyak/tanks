var Events = (function() {
    var bot_tank;
    if (!!window.EventSource) {
      var sse_source = new EventSource('/stream');
    } else {
      // Result to xhr polling :(
      vlog.log('No SSE support');
      return;
    }
    var uuid = '';

    sse_source.addEventListener('uuid', function(e) {
        uuid = e.data;
        console.log('uuid: ' + uuid);
    });

    sse_source.addEventListener('message', function(e) {
      vlog.log('SSE: ' + e.data);
    }, false);

    sse_source.addEventListener('open', function(e) {
      vlog.log('SSE: Connection was opened.');
      $.get('/bot').done(function() { vlog.log('bot requested'); });
    }, false);

    sse_source.addEventListener('error', function(e) {
      if (e.eventPhase == EventSource.CLOSED) {
        vlog.log('SSE: Connection was closed.');
      }
    }, false);

    sse_source.addEventListener('bot', function(event) {
        console.log('bot: ' + event.data);
        // vlog.log('bot: ' + event.data);
        var data = JSON.parse(event.data);
        switch (data.type) {
            case 'create':
                bot_tank = new Tank(Map.context(), function() {
                    console.log('set pos: ', data.position);
                    bot_tank.place(data.position.x, data.position.y);
                });
            break;
            default:
            break;
        }
    }, false);


} ());

