/* http://docs.dotcloud.com/services/nodejs/

require('http').createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  output = "Fucking Tanks Are Where?!\n";
  for (k in request.headers) {
    output += k + '=' + request.headers[k] + '\n';
  }
  response.end(output);
}).listen(8080);

process.on('SIGTERM', function () {
    console.log('Got SIGTERM exiting...');
    // do some cleanup here
    process.exit(0);
});

*/

var sse = require('./sse.js');

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;

var bots = [],
  bot_pos = { x: 0, y: 0 },
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

    var direction = { x: 1, y: 0 };
    setTimeout(function() {
      interval = setInterval(function() {
        bot_pos.x += direction.x * 0.04 * 50 * (50/24);
        bot_pos.y += direction.y * 0.04 * 50 * (50/24);

        if (bot_pos.x <= 20 && bot_pos.y <= 20) {
          direction = { x: 1, y: 0 };
        } else if (bot_pos.x >= 400 && bot_pos.y <= 20) {
          direction = { x: 0, y: 1 };
        } else if (bot_pos.x >= 400 && bot_pos.y >= 400) {
          direction = { x: -1, y: 0 };
        } else if (bot_pos.x <= 20 && bot_pos.y >= 400) {
          direction = { x: 0, y: -1 };
        } else if (bot_pos.x >= 400) {
          direction = { x: 0, y: 1 };
        }

        io.sockets.in('room1').emit('bot', { type: 'place', position: bot_pos });
      }, 1000 / 24);
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
  console.log('connect OK: ' + socket.store.id);
  socket.emit('message', 'connect OK');
  socket.join('room1');

  putBot(1, socket);

  socket.on('report', function (data) {

  });

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

