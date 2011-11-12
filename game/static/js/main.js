window.onload = function() {
    var source = new EventSource('/stream');
    var uuid = '';

    source.addEventListener('uuid', function(e) {
        uuid = e.data;
        console.log('uuid: ' + uuid);
    });

    source.addEventListener('message', function(e) {
        console.log('message: ' + e.data);
    }, false);

    source.addEventListener('open', function(e) {
        console.log('SSE open');
    }, false);

    source.addEventListener('error', function(e) {
        $.post('/unsubscribe/' + uuid).done(function() {
            if (e.eventPhase == EventSource.CLOSED) {
                console.log('SSE close');
            }
        });
    }, false);
}
