function canvasSupport () {
    return !!document.createElement('testcanvas').getContext;
}

var CanvasBlackjack = (function(id) {
    var canvas,
        context,
        block_size = 60, // размер одного квадрата поля
        toClear = []; // номера клеток, которые будут очищены
    
    function init() {
        canvas = document.getElementById(id);
        if (!canvas || !canvas.getContext) { 
            vLog.log('Canvas element not found');
            return false;
        }
        context = canvas.getContext('2d');
        this.renderField({ x: 0, y: 0, width: 10, height: 10 });
        MainLoop.pushClear(this.renderField);
    };
    
    function renderField(rect) {
        if (!rect) {
            Map.render({ tiles: toClear });
        } else {
            Map.render(rect);
        }
    };
    
    function center() {
        canvas.style.left = Math.max(0, 0.5 * (document.width - canvas.clientWidth)) + 'px';
        canvas.style.top  = Math.max(0, 0.5 * (document.height - canvas.clientHeight)) + 'px';
    };
    
    function clear(cells) {
        if (cells && !isNaN(cells.x) && !isNaN(cells.y) && !isNaN(cells.width) && !isNaN(cells.height)) {
            for (var x = cells.x; x < cells.width + cells.x; x += 1) {
                for (var y = cells.y; y < cells.height + cells.y; y += 1) {
                    if (x > -1 && x < 10 && y > -1 && y < 10 && toClear.indexOf(x + y * 10) == -1) {
                        toClear.push(x + y * 10);
                    }
                }
            }
        } else {
            cells.forEach(function(cell) { 
                if (toClear.indexOf(cell) == -1) {
                    toClear.push(cell);
                }
            });
        }
    };
    /*
    function dontClear(cells) {
        cells.forEach(function(cell) { 
            if (toClear.indexOf(cell) != -1) {
                toClear.splice(toClear.indexOf(cell), 1);
            }
        });
    };
    */
    return {
        init: init,
        renderField: renderField,
        width: function() { return canvas.clientWidth; },
        height: function() { return canvas.clientHeight; },
        blockSize: function() { return block_size; },
        center: center,
        context: function() { return context; }, // TODO: this is very bad! makes object too open
        clear: clear
    }
})('canvasOne');

