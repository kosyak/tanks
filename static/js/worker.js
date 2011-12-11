self.addEventListener('message', function(e) {
    // var data = JSON.parse(e.data);
    var data = e.data;
    switch (data.img) {
        case 'rotate':
            var angle = data.angle,
                context = data.context,
                out_context = data.out_context;
            self.postMessage(out_context);
        break;
        default:
        break;
    }
}, false);
