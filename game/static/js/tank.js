/**
 * Объект танка
 *
 * @param CanvasRenderingContext2D container контекст, на котором будет рисоваться танк
 *
 **/

function Tank(context) {
    this.img_src = '../img/tank_top.png';
    this.img = new Image();
    this.img.src = this.img_src;
    this.context = context;
    
    
}

Tank.prototype.place = function(x, y) {
    this.context.drawImage(this.img, x, y);
}