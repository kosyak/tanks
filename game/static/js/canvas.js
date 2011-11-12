function canvasSupport () {
    return !!document.createElement('testcanvas').getContext;
}

function initCanvas(id) {
    var canvas = document.getElementById(id);
    if (!canvas || !canvas.getContext) { 
        console.error('Canvas element not found');
        return false;
    }
    console.log(canvas);
    var context = canvas.getContext('2d');
    context.fillStyle = "#ffffaa";
    context.fillRect(0, 0, 500, 300);
}