define(['./vlog', './Tank', './Map', 'http://' + location.hostname + ':8080/socket.io/socket.io.js'], function(vlog, Tank, Map) {
  var bot_tank,
    client_tanks = {},
    uuid = '',
    socket,
    events = [],
    started = false;

  function start(uuid_callback) {
    Tank = Tank || require('Tank');
    socket = io.connect('http://' + location.hostname + ':8080');
    socket.on('uuid', function (data) {
      uuid = data.uuid;
      console.log('uuid: ', data.uuid);
      if (typeof uuid_callback == 'function') {
        uuid_callback(uuid);
      }
    });

    socket.on('message', function(data) {
      vlog.log('WS: ', data);
    });

    socket.on('bot', function(data) {
      events.push(data);
    });

    socket.on('clients', function(data) {
      events.push({ type: 'clients', clients: data.clients });
    });

    socket.on('remove', function(data) {
      events.push({ type: 'remove', id: data.id });
    });

    started = true;
  }

  // TODO: не совсем receive: функция ставит объекты по местам так, как сказал сервер
  function receive() {
    Tank = Tank || require('Tank');
    if (!(started && Map && Map.context)) {
      return false;
    }
    // console.log(events, events.length);
    while (events.length) {
      var data = events[0];
      /*var data = */events.splice(0, 1);
      switch (data.type) {
        case 'create':
          bot_tank = new Tank({
            id: data.id
          }, function() {
            bot_tank.place(data.position.x, data.position.y, data.direction);
          });
        break;
        case 'place': {
          bot_tank = bot_tank || new Tank({
            id: data.id
          });
          bot_tank.place(data.position.x, data.position.y, true, data.direction);
        }
        break;
        case 'clients':
          for (var id in data.clients) {
            if (id !== uuid) {
              // if (typeof client_tanks[uuid] === 'undefined') { console.log('new tank: ', data.clients[uuid]); }
              client_tanks[id] = client_tanks[id] || new Tank({
                id: id
              });
              client_tanks[id].place(data.clients[id].x, data.clients[id].y, true, data.clients[id].direction);
            }
          }
        break;
        case 'remove':
          console.log('remove: ' + client_tanks[data.id]);
          if (client_tanks[data.id] && client_tanks[data.id].remove) {
            client_tanks[data.id].remove();
            delete client_tanks[data.id];
          } else {
            var tankCache = Tank.prototype.globalTankCache.call(this);
            for (var i = 0; i < tankCache.length; i += 1) {
              if (tankCache[i].id === data.id) {
                tankCache[i].remove();
              }
            }
          }
        break;
        default:
        break;
      }
    }
    return true;
  }

  function requestTank() {
    socket.emit('request');
  }

  function report() {
    if (!(started && Map && Map.data)) {
      return false;
    }
    socket.emit('report', {
      uuid: uuid,
      time: Date.now(),
      map: Map.data(),
      tanks: require('Tank').prototype.TanksData()
    });
    return true;
  }

  function reportKill(killer, victim, callback) {
    console.log(killer, 'killed', victim);
    if (!(started && Map && Map.data)) {
      return false;
    }
    socket.emit('kill', {
      uuid: uuid,
      killer: killer.id,
      victim: victim.id,
      time: Date.now()
    }, function() {
      if (typeof callback == 'function') {
        callback();
      }
    });
    return true;
  }

  /* var self = this;
  MainLoop.push(function() { self.report(); }); */

  return {
    start: start,
    report: report,
    reportKill: reportKill,
    receive: receive,
    requestTank: requestTank
  };
});
