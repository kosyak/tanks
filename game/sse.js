var uuid = require('node-uuid');
var subscribers = {};

exports.subscribe = function(request, response) {
    if (request.headers.accept && request.headers.accept === 'text/event-stream' && request.url === '/stream') {
        var id = uuid();
        subscribers[id] = response;
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        console.log('SSE open [' + id + ']');
        this.send(id, 'uuid', response);
    }
}

/**
 * Генерирует Server Sent Events
 * @param data данные, которые будут закодированы в JSON
 * @param event название события, по умолчанию 'data'
 * @param subscribers подписчики, по умолчанию - все
 */
exports.send = function(data, event, res) {
    if (!this.ready()) {
        console.error('SSE not ready');
        return false;
        // this.init();
    }
    var send_to = (res) ? { 0: res } : subscribers;
    if (typeof data === 'object') {
        data = JSON.stringify(data);
    }

    for (var key in send_to) {
        // console.log('DATA', ((event) ? 'event: ' + event + '\n' : '') + 'data: ' + data + '\n\n');
        send_to[key].write(((event) ? 'event: ' + event + '\n' : '') + 'data: ' + data + '\n\n');
        // res.end();
    }
    console.log('SSE sent: ' + data);
}

exports.unsubscribe = function(id) {
    delete subscribers[id];
    console.log('SSE close [' + id + ']');
}

exports.ready = function() {
    return true;// typeof req !== 'undefined' && typeof res !== 'undefined';
}

