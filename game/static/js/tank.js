/**
 * Объект танка
 *
 * @param CanvasRenderingContext2D container контекст, на котором будет рисоваться танк
 *
 **/

function Tank(context, callback) {
    this.imgURI = '/img/tank_top.png'; // URI! Yo!
    this.img = new Image();
    this.img.src = this.imgURI;
    if (typeof callback === 'function') {
        this.img.onload = function() { this.lastMove = new Date(); callback(); }
    }
    this.deltaChar = {};

    this.context = context;

    this.speed = 0.1; // pixels per millisecond
    this.lastMove = new Date();
    this.pos = { x: 0, y: 0 };

    this.isMoving = false;
    /* MainLoop.push(this.watchKey);
    MainLoop.push(this.unWatchKey); */
    /* window.addEventListener('onkeydown', function(e) { vLog.log('keydown: ' + e.charCode); });
    window.addEventListener('onkeyup', function(e) { vLog.log('keyup: ' + e.charCode); });
    window.addEventListener('onkeypress', function(e) { vLog.log('keypress: ' + e.charCode); }); */
    /* document.onkeydown = function(e) { vLog.log('keydown: ' + e.charCode); };
    document.onkeyup = function(e) { vLog.log('keyup: ' + e.charCode); };
    document.onkeypress = function(e) { vLog.log('keypress: ' + e.charCode); }; */
    this.waitForMovement();
    this.waitForStop();
}

Tank.prototype.place = function(x, y) {
    if (!isNaN(x) && !isNaN(y)) {
        this.pos = {x: x, y: y};
    }
    this.context.drawImage(this.img, this.pos.x, this.pos.y);
}

Tank.prototype.keyListener = function(event) {
    var char_code = event.which/*charCode*/,
        key = String.fromCharCode(char_code).toLowerCase();
    // vLog.log(event);
    vLog.log('Key ' + key);
    if (['w', 'a', 's', 'd'].indexOf(key) != -1) {
        this.move(char_code);
    }
}
/*
Tank.prototype.watchKey = function() {
    vLog.log('watchKey fired');
    window.addEventListener('onkeypress', this.keyListener, false);
}

Tank.prototype.unWatchKey = function() {
    vLog.log('unWatchKey fired');
    window.removeEventListener('onkeypress', this.keyListener, false);
}
*/

Tank.prototype.waitForMovement = function() {
    var self = this;
    document.onkeydown = function(event) {
        if (!self.isMoving) {
            function moving_func() {
                self.isMoving = setTimeout(moving_func, 30);
                self.keyListener(event);
            }
            moving_func();
            // self.waitForStop();
        }
    };
};

Tank.prototype.waitForStop = function() {
    var self = this;
    document.onkeyup = function() {
        clearTimeout(self.isMoving);
        self.isMoving = false;
        // self.waitForMovement();
    };
};

Tank.prototype.deltaFromCharCode = function(char_code) {
    var keys_deltas = {
        'w': { x: 0,  y: -1 },
        'a': { x: -1, y: 0 },
        's': { x: 0,  y: 1 },
        'd': { x: 1,  y: 0 }
    };
    return keys_deltas[String.fromCharCode(char_code).toLowerCase()];
};

Tank.prototype.move = function(char_code) {
    var delta = this.deltaFromCharCode(char_code),
        time = new Date(); // TODO: check Date.now() compatibility and use if possible
    // if (this)
    this.pos.x += delta.x * this.speed * 30; // @waitForMovement
    this.pos.y += delta.y * this.speed * 30; // @waitForMovement
    CanvasBlackjack.renderField();
    this.place();
    this.lastMove = time;
}
