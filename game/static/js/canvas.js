function initCanvas(id) {
    var canvas = document.getElementById(id);
    if (!canvas || !canvas.getContext) { 
        console.error('Canvas element not found');
        return false;
    }
    console.log(canvas);
}