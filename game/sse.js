var uuid = require('node-uuid');
var subscribers = {};

exports.subscribe = function(request, response) {
    if (request.headers.accept && request.headers.accept === 'text/event-stream') {
        var id = uuid();
        subscribers[id] = response;

        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        console.log('SSE open [' + id + ']');
        this.send(id, response, 'uuid');
        this.send('hi', response);
        // res.end();
    }
}

/**
 * Генерирует Server Sent Events
 * @param data данные, которые будут закодированы в JSON
 * @param subscriber подписчик, по умолчанию - все подписчики
 * @param event название события, по умолчанию 'data'
 */
exports.send = function(data, subscriber, event) {
    if (!this.ready()) {
        console.error('SSE not ready');
        return false;
        // this.init();
    }
    var send_to = (subscriber) ? { 0: subscriber } : subscribers;
    if (typeof data === 'object') {
        data = JSON.stringify(data);
    }

    for (key in send_to) {
        send_to[key].write(((event) ? 'event: ' + event + '\n' : '') + 'data: ' + data + '\n\n');
        // res.end();
    }
    console.log('SSE sent [' + Array.prototype.slice.call(send_to) + ']');
}

exports.unsubscribe = function(id) {
    delete subscribers[id];
    console.log('SSE close [' + id + ']');
}

exports.ready = function() {
    return true;// typeof req !== 'undefined' && typeof res !== 'undefined';
}

