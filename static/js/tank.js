/**
 * Объект танка
 *
 * @param CanvasRenderingContext2D container контекст, на котором будет рисоваться танк
 * @param Object keys массив кодов клавиш { left: key_left, top: key_top, right: key_right, down: key_bottom }
 *
 **/

 var globalTankCache = [];
 // TODO: сделать ее 'static' для Tank
 function TanksData() {
     var data = [];
     for (var i = 0; i < globalTankCache.length; i += 1) {
         data.push(globalTankCache[i].data());
     }
     return data;
 }

function Tank(context, keys, callback) {
    globalTankCache.push(this);

    this.key = (keys && typeof keys !== 'function') ? keys : false;
    console.log(this.key);
    this.imgURI = '/img/tank.png'; // URI! Yo!
    this.img = new Image();
    this.img.src = this.imgURI;
    if (typeof callback === 'function' || typeof keys === 'function') {
        this.img.onload = function() { this.lastMove = new Date(); (typeof callback === 'function') ? callback() : keys(); }
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
    MainLoop.push(function() { self.place(); });
}

Tank.prototype.place = function(x, y, no_render) {
    if (!isNaN(x) && !isNaN(y)) {
        this.pos = {x: x, y: y};
    }
    CanvasBlackjack.clear({
        x: Math.floor(this.pos.x / CanvasBlackjack.blockSize())-1,
        y: Math.floor(this.pos.y / CanvasBlackjack.blockSize())-1,
        width: 3,
        height: 3
    });
    if (!no_render) {
        this.context.drawImage(this.img, this.pos.x, this.pos.y);
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
    var delta = this.deltaFromCharCode(char_code);
    this.pos.x += delta.x * this.speed * MainLoop.fps();
    this.pos.y += delta.y * this.speed * MainLoop.fps();
}

Tank.prototype.data = function() {
    return this.pos;
}
