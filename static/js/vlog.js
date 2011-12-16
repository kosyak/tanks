/* vlog - visual Log */
define([], function(vlog) {
    return (function(id) {
        var container = false,
            container_id = id;
        function log(msg) {
            if (!container) {
                container = document.getElementById(container_id);
            }
            if (!container || (typeof container.innerHTML === 'undefined')) {
                console.error('No vlog to write found');
                return false;
            }
            var date = new Date();
            if (msg.toString()) {
                container.innerHTML = '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '] ' + msg.toString();
            }
            console.log(msg);
        }
        return {
            log: log
        }
    }) ('log');
});
