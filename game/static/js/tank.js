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
    this.deltaChar = {}

    this.context = context;
    
    this.speed = 0.1; // pixels per millisecond
    this.lastMove = new Date();
    this.pos = { x: 0, y: 0 };
}

Tank.prototype.place = function(x, y) {
    if (!isNaN(x) && !isNaN(y)) {
        this.pos = {x: x, y: y};
    }
    this.context.drawImage(this.img, this.pos.x, this.pos.y);
}

Tank.prototype.keyAction = function(char_code) {
    var key = String.fromCharCode(char_code);
    if (['w', 'a', 's', 'd'].indexOf(key) != -1) {
        this.move(char_code);
    }
}

Tank.prototype.deltaFromCharCode = function(char_code) {
    var keys_deltas = {
        'w': { x: 0,  y: -1 },
        'a': { x: -1, y: 0 },
        's': { x: 0,  y: 1 },
        'd': { x: 1,  y: 0 }
    };
    return keys_deltas[String.fromCharCode(char_code)];
}

Tank.prototype.move = function(char_code) {
    var delta = this.deltaFromCharCode(char_code),
        time = new Date(); // TODO: check Date.now() compatibility and use if possible
    // if (this)
    this.pos.x += delta.x * this.speed * (time - this.lastMove);
    CanvasBlackjack.renderField();
    this.place();
    this.lastMove = time;
}