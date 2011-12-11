var WS = (function() {
    var bot_tank,
        uuid = '',
        socket = io.connect('http://' + location.host),
        events = [];

    socket.on('uuid', function (data) {
        uuid = data;
        vLog.log('uuid: ' + uuid);
    });

    socket.on('message', function(data) {
      vLog.log('WS: ', data);
    });

    /* sse_source.addEventListener('open', function(e) {
      vLog.log('SSE: Connection was opened.');
      $.get('/bot').done(function() { vLog.log('bot requested'); });
    }, false);

    sse_source.addEventListener('error', function(e) {
      if (e.eventPhase == EventSource.CLOSED) {
        vLog.log('SSE: Connection was closed.');
      }
    }, false); */

    socket.on('bot', function(data) {
        // vLog.log('bot: ' + data);
        events.push(data);
//            console.log(bot_tank, data.type, Date.now());
    });

    // TODO: не совсем receive: функция ставит объекты по местам так, как сказал сервер
    function receive() {
        // console.log(events, events.length);
        while (events.length) {
            var data = events[0];
            /*var data = */events.splice(0, 1);
            switch (data.type) {
                case 'create':
                    bot_tank = new Tank(CanvasBlackjack.context(), function() {
                        bot_tank.place(data.position.x, data.position.y);
                    });
                break;
                case 'place': {
                    bot_tank = bot_tank || new Tank(CanvasBlackjack.context());
                    bot_tank.place(data.position.x, data.position.y, true);
                }
                break;
                default:
                break;
            }
        }
    }

    function report() {
        socket.emit('report', {
            uuid: uuid,
            time: Date.now(),
            map: Map.data(),
            tanks: TanksData()
        });
    };

    /* var self = this;
    MainLoop.push(function() { self.report(); }); */

    return {
        report: report,
        receive: receive
    };
} ());
