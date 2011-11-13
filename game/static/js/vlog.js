/* vLog - visual Log */

var vLog = (function(id) {
    var container = document.getElementById(id);
    function log(msg) {
        var date = new Date();
        if (msg.toString()) {
            container.innerHTML = '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '] ' + msg.toString();
        }
        console.log(msg);
    }
    return {
        log: function() {}
    }
}) ('log');