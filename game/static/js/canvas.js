function canvasSupport () {
    return !!document.createElement('testcanvas').getContext;
}

var CanvasBlackjack = (function() {
    var canvas,
        context,
        block_size = 10; // размер одного квадрата поля
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
        var x, y;
        for (x = 0; x < canvas.innerWidth; x += block_size) {
            for (y = 0; y < canvas.innerHeight; y += block_size) {
                context.fillStyle = ((x + y) % 2) ? '#000000' : '#ffffff';
                context.fillRect(x, y, block_size, block_size);
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

