var sse = require('./sse.js');

var DIR_UP = 0,
  DIR_RIGHT = 1,
  DIR_DOWN = 2,
  DIR_LEFT = 3,
  DIR_DELTA = [ '0,-1', '1,0', '0,1', '-1,0' ];

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;

var bots = [],
  bot_pos = { x: 0, y: 0 },
  clients = {},
  interval,
  express = require('express'),
  app = express.createServer(
    // express.logger(),
    // ress.bodyParser()
  ),
  io = require('socket.io').listen(app);

function authCallback(error, authorized) {
  if (!authorized) {
    console.error('WS auth failed: ', error);
  } else {
    console.log('WS auth OK');
  }
}

function putBot(id, socket) {
  if (bots.indexOf(id) == -1) {
    bot_pos = { x: 140, y: 140 };
    socket.emit('bot', { type: 'create', position: bot_pos });
    console.log('bot sent');
    bots.push(id);

    var delta = { x: 1, y: 0 },
      direction = DIR_RIGHT;
    setTimeout(function() {
      interval = setInterval(function() {
        bot_pos.x += delta.x * 0.04 * 50;
        bot_pos.y += delta.y * 0.04 * 50;

        if (bot_pos.x <= 70 && bot_pos.y <= 70) {
          delta = { x: 1, y: 0 };
          direction = DIR_RIGHT;
        } else if (bot_pos.x >= 400 && bot_pos.y <= 70) {
          delta = { x: 0, y: 1 };
          direction = DIR_DOWN;
        } else if (bot_pos.x >= 400 && bot_pos.y >= 400) {
          delta = { x: -1, y: 0 };
          direction = DIR_LEFT;
        } else if (bot_pos.x <= 70 && bot_pos.y >= 400) {
          delta = { x: 0, y: -1 };
          direction = DIR_UP;
        } else if (bot_pos.x >= 400) {
          delta = { x: 0, y: 1 };
          direction = DIR_DOWN;
        }

        io.sockets.in('room1').emit('bot', { type: 'place', position: bot_pos, direction: direction });
        //console.log('direction: ' + direction);
        io.sockets.in('room1').emit('clients', { clients: clients });
        // console.log('clients: ', clients);
      }, 1000 / 50);
    }, 2000);
  }
}

function moveBot(id, socket) {
  if (!interval) {

  } else {

  }
}

/*io.configure(function (){
    // io.enable('authorization');
    io.set('authorization', function (handshakeData, callback) {
        // console.log('handshake: ', handshakeData);
        authCallback(null, true); // error first callback style
        putBot(handshakeData.cookie);
    });
});*/

/*
// https://github.com/joyent/node/wiki/Socket.IO-and-Heroku
io.set('transports', ['xhr-polling']);
io.set('polling duration', 10);
*/

io.configure(function (){
  io.set('log level', 1);
});


io.sockets.on('connection', function (socket) {
  var uuid = socket.store.id,
    interval;
  console.log('connect OK: ' + uuid);
  socket.emit('uuid', { uuid: uuid});
  socket.join('room1');
  clients[uuid] = {
    x: 70,
    y: 70
  }

  putBot(1, socket);

  socket.on('report', function (data) {
    // console.log('report data', data);
    if (data.tanks && data.tanks.length) {
      clients[uuid] = { // === data.uuid ??
        // с клиента приходят данные ровно об одном танке
        x: data.tanks[0].x,
        y: data.tanks[0].y,
        direction: data.tanks[0].direction
      }
    }
  });
  socket.on('kill', function (data) {
    console.log('kill data', data);
    /* if (data.tanks && data.tanks.length) {
      clients[uuid] = { // === data.uuid ??
        // с клиента приходят данные ровно об одном танке
        x: data.tanks[0].x,
        y: data.tanks[0].y,
        direction: data.tanks[0].direction
      }
    }*/
  });
  socket.on('disconnect', function() {
    console.log('disconnect: ' + uuid);
    io.sockets.in('room1').emit('remove', { id: uuid });
    delete clients[uuid];
    clearInterval(interval);
  });

  // interval = setInterval(function() {  }, 1000 / 50);
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'himitsu' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
    // app.use(express.static(__dirname + '/public'));
    app.use(express.logger({ format: ':method :url' }));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  // app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler({ showStack: true, umpExceptions: true }));
});

app.get('/', function(req, res){
  res.render('index', { layout: false, pageTitle: 'Tanks will be here soon. We promise.', youAreUsingJade: true, app_id: '' });
});

app.get(/^\/node_modules.*/, function(req, res){
  throw new Error('Access denied');
});

app.get('/404', function(req, res){
  throw new NotFound;
});

app.get('/500', function(req, res){
  throw new Error('keyboard cat!');
});

// app.listen(8080);
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});

