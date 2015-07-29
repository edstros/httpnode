var http = require('http');
var https = require('https');

module.exports = function (port) {
  http.createServer(function (req, res) {
    if (req.method === 'GET' && req.url === '/weather') {
      res.writeHeader(200, { //200 is the 'success' response code
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' //so that it can be seen on codepen
      });
      //http.get('http://swapi.co/api/films/')
      https.get('https://api.forecast.io/forecast/d9457495596bb7c73b77f404895cdcd9/37.8267,-122.423')
        .on('response', function (xhr) {
          xhr.pipe(res);
          //  ^^^^^^^ this does what the function inthe star wars call below does
          //just pipes the response from the server instead of parsing it as below
        });
    } else if (req.method === 'GET' && req.url === '/starwarsmovies') {
      http.get('http://swapi.co/api/films/')
        .on('response', function (xhr) {
          var body = '';
          xhr
            .on('data', function (chunk) {
              body += chunk;
            })
            .on('end', function () {
              var data = JSON.parse(body)
              data.results.forEach(function (r) { //loop over the returned data
                res.write(r.title + '\n'); //these are the star wars titles displayed on the browser
              });
              res.end();
            });
        });
    } else {
      res.writeHead(403);
      res.end('Access Denied!');
    }
  }).listen(port);
}
