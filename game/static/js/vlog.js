/* vLog - visual Log */

var vLog = (function(id) {
    var container = document.getElementById(id);
    function log(msg) {
        if (!container || !container.innerHTML) {
            console.error('No vLog to write found');
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