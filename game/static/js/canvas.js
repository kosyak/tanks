function canvasSupport () {
    return !!document.createElement('testcanvas').getContext;
}

var CanvasBlackjack = (function(id) {
    var canvas,
        context,
        block_size = 40; // размер одного квадрата поля
    function init() {
        canvas = document.getElementById(id);
        if (!canvas || !canvas.getContext) { 
            console.error('Canvas element not found');
            return false;
        }
        console.log(canvas);
        context = canvas.getContext('2d');
        context.fillStyle = "#ffffaa";
        context.fillRect(0, 0, 500, 300);
    }
    function renderField() {
        var x, y, flag = { x: false, y: false };
        for (x = 0; x < canvas.clientWidth; x += block_size) {
            flag.x = !flag.x;
            flag.y = flag.x;
            for (y = 0; y < canvas.clientHeight; y += block_size) {
                context.fillStyle = flag.y ? '#000000' : '#ffffff';
                context.fillRect(x, y, block_size, block_size);
                flag.y = !flag.y;
            }
        }
        
    }
    return {
        init: init,
        renderField: renderField
    }
})('canvasOne');

function initCanvas(id) {
}

