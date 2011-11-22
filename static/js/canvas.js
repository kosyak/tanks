function canvasSupport () {
    return !!document.createElement('testcanvas').getContext;
}

var CanvasBlackjack = (function(id) {
    var canvas,
        context,
        block_size = 60; // размер одного квадрата поля
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
        this.renderField();
    };
    function renderField(rect) {
        rect = rect || { 
            x: 0, 
            y: 0, 
            width: Math.floor(canvas.clientWidth / block_size), 
            height: Math.floor(canvas.clientHeight / block_size)
        };
        var x, y;
        for (x = Math.max(0, rect.x); x < Math.min(10, rect.x + rect.width); x += 1) {
            for (y = Math.max(0, rect.y); y < Math.min(10, rect.y + rect.height); y += 1) {
                context.fillStyle = (x % 2 + y % 2) % 2 ? '#000000' : '#ffffff';
                context.fillRect(x * block_size, y * block_size, block_size, block_size);
            }
        }
        
    };
    function center() {
        canvas.style.left = Math.max(0, 0.5 * (document.width - canvas.clientWidth)) + 'px';
        canvas.style.top  = Math.max(0, 0.5 * (document.height - canvas.clientHeight)) + 'px';
    };
    
    return {
        init: init,
        renderField: renderField,
        width: function() { return canvas.clientWidth; },
        height: function() { return canvas.clientHeight; },
        blockSize: function() { return block_size; },
        center: center,
        context: function() { return context; } // TODO: this is very bad! makes object too open
    }
})('canvasOne');

function initCanvas(id) {
}

