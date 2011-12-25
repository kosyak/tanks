define(['./vlog', './Keyboard', './MainLoop', './Map', './WS'], function(vlog, Keyboard, MainLoop, Map, WS) {
  var globalTankCache = [];

  var DIR_UP = 0,
    DIR_RIGHT = 1,
    DIR_DOWN = 2,
    DIR_LEFT = 3,
    DIR_DELTA = [ '0,-1', '1,0', '0,1', '-1,0' ];

  var staticDir = document.location.port ? '/' : 'static/'; // Node or Lighty?
  var src_image = new Image();
  src_image.src = staticDir + 'img/sheet.png';

  function TanksData() {
    var data = [];
    for (var i = 0; i < globalTankCache.length; i += 1) {
      if (globalTankCache[i].key) {
        data.push(globalTankCache[i].data());
      }
    }
    return data;
  }

  function Bullet(tank) {
    MainLoop = MainLoop || require('MainLoop');

    this.speed = 0.10; // pixels per millisecond
    this.tank = tank;
    this.size = 14;
    this.pos = {
      x: tank.pos.x,
      y: tank.pos.y
    };
    switch (tank.direction) {
      case DIR_LEFT:
        this.pos.x += 0.5 * (Map.blockSize() - tank.width()) - 0.5 * this.width();
        this.pos.y += 0.5 * (tank.height() - this.height());
      break;
      case DIR_RIGHT:
        this.pos.x += Map.blockSize() - 0.5 * (Map.blockSize() - tank.width()) - 0.5 * this.width();
        this.pos.y += 0.5 * (tank.height() - this.height());
      break;
      case DIR_UP:
        this.pos.x += 0.5 * (tank.width() - this.width());
        this.pos.y += 0.5 * (Map.blockSize() - tank.height()) - 0.5 * this.height();
      break;
      case DIR_DOWN:
        this.pos.x += 0.5 * (tank.width() - this.width());
        this.pos.y += Map.blockSize() - 0.5 * (Map.blockSize() - tank.height()) - 0.5 * this.height();
      break;
    }

    this.startTime = Date.now();
    this.direction = tank.direction;
    var delta = DIR_DELTA[this.direction].split(',');
    this.delta = {
      x: delta[0] * this.speed * MainLoop.fps(),
      y: delta[1] * this.speed * MainLoop.fps()
    };

    /* src_image.addEventListener('load', function() {

    }, false); */
    var self = this;
    this.queryIndex = MainLoop.push(function() { self.placeMove(); });

  }

  Bullet.prototype.width = function(direction) {
    return this.size;
  }

  Bullet.prototype.height = function(direction) {
    return this.size;
  }

  Bullet.prototype.placeMove = function(no_render) {

    if (!no_render && (Map.collide(this, true) || this.collide())) {
      no_render = true;
      this.remove();
    }

    Map.clear({
      x: Math.floor(this.pos.x / Map.blockSize())-1,
      y: Math.floor(this.pos.y / Map.blockSize())-1,
      width: 3,
      height: 3
    });

    if (!no_render) {
      this.tank.context.drawImage(src_image,
        5 * Map.blockSize() + 23,
        2 * Map.blockSize() + 23,
        this.size,
        this.size,
        this.pos.x,
        this.pos.y,
        this.size,
        this.size);
    }
    this.pos.x += this.delta.x;
    this.pos.y += this.delta.y;
  }
  
  /**
   * Убиваем танки пулями
   * TODO: убивать пули пулями
   */
  Bullet.prototype.collide = function() {
    for (var i = 0; i < globalTankCache.length; i += 1) {
      var tank = globalTankCache[i];
      if (tank !== this.tank) {
        if (this.pos.x + this.width() < tank.pos.x ||
          this.pos.x > tank.pos.x + tank.width() ||
          this.pos.y + this.height() < tank.pos.y ||
          this.pos.y > tank.pos.y + tank.height()) {
            continue;
        } else {
          tank.kill();
          return true;
        }
      }
    }
    return false;
  }

  Bullet.prototype.remove = function() {
    this.placeMove(true);
    MainLoop.remove(this.queryIndex);
    delete this.tank.bullet;
  }


  /**
   * Объект танка
   *
   * @param CanvasRenderingContext2D container контекст, на котором будет рисоваться танк
   * @param Object keys массив кодов клавиш { left: key_left, top: key_top, right: key_right, down: key_bottom }
   *
   **/

  function Tank(context, keys, callback) {
    MainLoop = MainLoop || require('MainLoop');
    globalTankCache.push(this);

    this.key = (keys && typeof keys !== 'function') ? keys : false;
    console.log(this.key);
    this.imgURI = staticDir + 'img/tank.png'; // URI! Yo!
    this.img = new Image();
    this.img.src = this.imgURI;
    this.bullet = null;
    // TODO: fuck this shit!
    this.rotate_delta = 5;// (this.img.naturalWidth && this.img.naturalHeight) ? 0.5 * Math.abs(self.img.naturalWidth - self.img.naturalHeight) : 0;
    this.direction = DIR_UP;
    var self = this;
    if (typeof callback === 'function' || typeof keys === 'function') {
      this.img.onload = function() {
        self.lastMove = new Date();
        self.rotate_delta = 0.5 * Math.abs(self.img.naturalWidth - self.img.naturalHeight);
        (typeof callback === 'function') ? callback() : keys();
      }
    }
    this.deltaChar = {};

    this.context = context;

    this.speed = 0.04; // pixels per millisecond
    this.lastMove = new Date();
    this.pos = { x: 0, y: 0 };
    /*
    var worker = new Worker('js/worker.js'),
        out_canvas = document.createElement('canvas');
    out_canvas.style.width = '200px';
    out_canvas.style.height = '200px';
    var out_context = out_canvas.getContext('2d');
    worker.postMessage({ img: 'rotate', angle: 1.57, out_context: out_context });

    worker.addEventListener('message', function(e) {
        console.log('worker.js', e.data);
    }, false);
    */

    var self = this;
    if (this.key) {
      for (var c in this.key) {
        if (c !== 'shoot') {
          Keyboard.assign(this.key[c], function(keycode) {
            self.move(keycode);
          });
        } else {
          Keyboard.assign(this.key[c], function(keycode) {
            self.bullet = self.bullet || new Bullet(self);
          });

        }
      }
    }
    this.queryIndex = MainLoop.push(function() { self.place(); });
  }

  Tank.prototype.width = function(direction) {
    direction = direction || this.direction;
    if (direction === DIR_UP || direction === DIR_DOWN) {
      return this.img.naturalWidth;
    } else {
      return this.img.naturalHeight;
    }
  }

  Tank.prototype.height = function(direction) {
      direction = direction || this.direction;
      if (direction === DIR_UP || direction === DIR_DOWN) {
          return this.img.naturalHeight;
      } else {
          return this.img.naturalWidth;
      }
  }

  Tank.prototype.placeCell = function(x, y) {
    x = Math.min(Math.max(x, 0), Math.floor(Map.width() / Map.blockSize()) - 1);
    y = Math.min(Math.max(y, 0), Math.floor(Map.height() / Map.blockSize()) - 1);
    this.place(x * Map.blockSize() + 0.5 * (Map.blockSize() - this.width()), y * Map.blockSize() + 0.5 * (Map.blockSize() - this.height()));
  }

  Tank.prototype.place = function(x, y, no_render, set_direction) {
    if (typeof no_render === 'number' && no_render >= 0 && no_render <= 3) {
      set_direction = no_render;
      no_render = null;
    }
    if (typeof x === 'boolean') {
      no_render = x;
      x = y = null;
    }
    if (!isNaN(x) && !isNaN(y)) {
      this.pos = {x: x, y: y};
    }
    Map.clear({
      x: Math.floor(this.pos.x / Map.blockSize())-1,
      y: Math.floor(this.pos.y / Map.blockSize())-1,
      width: 3,
      height: 3
    });
    if (typeof set_direction !== 'undefined') {
      this.direction = set_direction;
      this.rotation = null;
    }
    if (!no_render) {
      if (this.rotation) {
        if (this.rotation.direction !== this.direction) {
          if ([DIR_UP, DIR_DOWN].indexOf(this.rotation.direction) > -1 && [DIR_LEFT, DIR_RIGHT].indexOf(this.direction) > -1) {
            this.pos.x += this.rotate_delta;
            this.pos.y -= this.rotate_delta;
          } else if ([DIR_UP, DIR_DOWN].indexOf(this.direction) > -1 && [DIR_LEFT, DIR_RIGHT].indexOf(this.rotation.direction) > -1) {
            this.pos.x -= this.rotate_delta;
            this.pos.y += this.rotate_delta;
          }
        } else {
          this.pos.x += this.rotation.delta.x * this.speed * MainLoop.fps();
          this.pos.y += this.rotation.delta.y * this.speed * MainLoop.fps();
        }
      }

      var direction = this.rotation ? this.rotation.direction : this.direction;

      // Не понимаю, почему нужно это смещение. Пока считаем за HACK
      var hack_delta = { x: 0, y: 0 };
      if (direction === DIR_LEFT) {
        hack_delta = { x: - this.rotate_delta, y: - this.rotate_delta };
      } else if (direction === DIR_RIGHT) {
        hack_delta = { x: this.rotate_delta, y: this.rotate_delta };
      }

      Map.collide(this); // метод сам правит координаты

      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.translate(hack_delta.x + this.pos.x + this.width(direction) / 2, hack_delta.y + this.pos.y + this.height(direction) / 2);
      this.context.rotate(direction * Math.PI / 2);
      this.context.drawImage(this.img, - this.width(direction) / 2, - this.height(direction) / 2);
      this.context.restore();

      if (this.rotation) {
        this.direction = this.rotation.direction;
        this.rotation = null;
      }
    }
    this.lastMove = new Date(); // TODO: check Date.now() compatibility and use if possible
  }

  Tank.prototype.deltaFromCharCode = function(char_code) {
    var keys_deltas = {};
    keys_deltas[this.key.top] = { x: 0,  y: -1 };
    keys_deltas[this.key.left] = { x: -1, y: 0 };
    keys_deltas[this.key.right] = { x: 0,  y: 1 };
    keys_deltas[this.key.down] = { x: 1,  y: 0 };
    return keys_deltas[char_code];
  };

  Tank.prototype.move = function(char_code) {
      var delta = this.deltaFromCharCode(char_code),
        new_dir = DIR_DELTA.indexOf(delta.x + ',' + delta.y);
      if (new_dir > -1 && new_dir !== this.direction) {
        this.rotation = { direction: new_dir, delta: delta };
      } else {
        this.rotation = null;
        this.pos.x += delta.x * this.speed * MainLoop.fps();
        this.pos.y += delta.y * this.speed * MainLoop.fps();
        Map.collide(this); // метод сам правит координаты
        if (this.collide()) {
          this.pos.x -= delta.x * this.speed * MainLoop.fps();
          this.pos.y -= delta.y * this.speed * MainLoop.fps();
        }
      }
  }

  Tank.prototype.data = function() {
    return { x: this.pos.x, y: this.pos.y, direction: this.direction };
  }

  Tank.prototype.remove = function() {
    this.place(true);
    MainLoop.remove(this.queryIndex);
  }
  
  Tank.prototype.kill = function(bullet) {
    WS.reportKill(bullet.tank, this);
    this.remove();
  }

  Tank.prototype.collide = function() {
    if (!this.key) { // is this a bot/directed by server?
      return false;
    }
    for (var i = 0; i < globalTankCache.length; i += 1) {
      var tank = globalTankCache[i];
      if (tank !== this) {
        if (this.pos.x + this.width() < tank.pos.x ||
          this.pos.x > tank.pos.x + tank.width() ||
          this.pos.y + this.height() < tank.pos.y ||
          this.pos.y > tank.pos.y + tank.height()) {
          continue;
        } else {
          return true;
        }
      }
    }
    return false;
  }

  Tank.prototype.globalTankCache = function() {
    return globalTankCache;
  }

  Tank.prototype.DIR_UP = DIR_UP;
  Tank.prototype.DIR_RIGHT = DIR_RIGHT;
  Tank.prototype.DIR_DOWN = DIR_DOWN;
  Tank.prototype.DIR_LEFT = DIR_LEFT;
  Tank.prototype.DIR_DELTA = DIR_DELTA;

  Tank.prototype.TanksData = TanksData;

  return Tank;
});



