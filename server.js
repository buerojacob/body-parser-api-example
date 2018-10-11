// https://www.npmjs.com/package/body-parser
// https://github.com/petkivim/nodejs-rest-api-example
// https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
// https://github.com/zhedahht/aci-ssl-helloworld
// jacobc@ubuntu:~/node_projects/nodejs-rest-api-example$ git remote set-url origin https://github.com/buerojacob/body-parser-api-example
// jacobc@ubuntu:~/node_projects/nodejs-rest-api-example$ git push -u origin master
// jacobc@ubuntu:~/node_projects/nodejs-rest-api-example$ git remote set-url origin https://github.com/buerojacob/body-parser-api-example
// jacobc@ubuntu:~/node_projects/nodejs-rest-api-example$ git push -u origin master

'use strict';

var express = require('express');
var bodyParser  = require("body-parser");

const https = require('https'), fs = require('fs'), helmet = require('helmet');

const options = {
  key: fs.readFileSync('/srv/www/keys/my-site-key.pem'),
  cert: fs.readFileSync('/srv/www/keys/chain.pem'),
  dhparam: fs.readFileSync('/var/www/example/sslcert/dh-strong.pem')
};

var app = express();

app.use(helmet()); // Add Helmet as a middleware

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is GET method." }
   res.end(JSON.stringify(response));
});

app.get('/:id', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is GET method with id=" + req.params.id + "." }
   res.end(JSON.stringify(response));
});

app.post('/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is POST method." }
   res.end(JSON.stringify(response));
});


/* Test mit postman
   Einstellungen POST body raw json
   body zum senden:
  {
	"Name": "Jacob", 
	"Vorname": "Claude"
  } */
app.post('/auth', function (req, res) {
  if (!req.body) {return res.sendStatus(400)} else {
    const name = req.body.Name;
    const vorname = req.body.Vorname;
    res.send('Name: ' + name + ' Vorname: ' + vorname);
  }
  });

app.put('/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is PUT method." }
   res.end(JSON.stringify(response));
});

app.delete('/', function (req, res) {
   res.writeHead(200, {'Content-Type': 'application/json'});
   var response = { "response" : "This is DELETE method." }
   res.end(JSON.stringify(response));
});

var server = app.listen(4000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node.js API app listening at http://%s:%s", host, port)

});

https.createServer(options, app).listen(8080);
