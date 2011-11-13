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
}

Tank.prototype.place = function(x, y) {
    this.context.drawImage(this.img, x, y);
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
}