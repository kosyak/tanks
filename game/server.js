// http://docs.dotcloud.com/services/nodejs/

require('http').createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  output = "Fucking Tanks Are Where?!\n";
  for (k in request.headers) {
    output += k + '=' + request.headers[k] + '\n';
  }
  response.end(output);
}).listen(8080);

/*
process.on('SIGTERM', function () {
    console.log('Got SIGTERM exiting...');
    // do some cleanup here
    process.exit(0);
});

*/