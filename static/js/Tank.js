define(['./vlog', './Keyboard', './MainLoop', './Map'], function(vlog, Keyboard, MainLoop, Map) {
  var globalTankCache = [];

  var DIR_UP = 0,
    DIR_RIGHT = 1,
    DIR_DOWN = 2,
    DIR_LEFT = 3,
    DIR_DELTA = [ '0,-1', '1,0', '0,1', '-1,0' ],
    MainLoop = require('./MainLoop'),
    Map = require('./Map');

  function TanksData() {
    var data = [];
    for (var i = 0; i < globalTankCache.length; i += 1) {
      if (globalTankCache[i].key) {
        data.push(globalTankCache[i].data());
      }
    }
    return data;
  }

  /**
   * Объект танка
   *
   * @param CanvasRenderingContext2D container контекст, на котором будет рисоваться танк
   * @param Object keys массив кодов клавиш { left: key_left, top: key_top, right: key_right, down: key_bottom }
   *
   **/

  function Tank(context, keys, callback) {
    var staticDir = document.location.port ? '/' : 'static/'; // Node or Lighty?
    globalTankCache.push(this);

    this.key = (keys && typeof keys !== 'function') ? keys : false;
    console.log(this.key);
    this.imgURI = staticDir + 'img/tank.png'; // URI! Yo!
    this.img = new Image();
    this.img.src = this.imgURI;
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
        Keyboard.assign(this.key[c], function(keycode) {
          self.move(keycode);
        });
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
        if (Map.collide(this) || this.collide()) {
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

  Tank.prototype.collide = function() {
    if (!this.key) {
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



