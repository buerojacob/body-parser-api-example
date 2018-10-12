// https://www.npmjs.com/package/body-parser
// https://github.com/petkivim/nodejs-rest-api-example
// https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
// https://github.com/zhedahht/aci-ssl-helloworld
// https://radiostud.io/nodeexpress-application-over-https/
// jacobc@ubuntu:~/node_projects/nodejs-rest-api-example$ git remote set-url origin https://github.com/buerojacob/body-parser-api-example
// jacobc@ubuntu:~/node_projects/nodejs-rest-api-example$ git push -u origin master
// jacobc@ubuntu:~/node_projects/nodejs-rest-api-example$ git remote set-url origin https://github.com/buerojacob/body-parser-api-example
// jacobc@ubuntu:~/node_projects/nodejs-rest-api-example$ git push -u origin master

'use strict';

var express = require('express');
var bodyParser  = require("body-parser");

const https = require('https'), fs = require('fs') /* , helmet = require('helmet') */ ;

const options = {
  key: fs.readFileSync('/usr/src/app/server.key'),
  cert: fs.readFileSync('/usr/src/app/server.crt'),
  // dhparam: fs.readFileSync('/var/www/example/sslcert/dh-strong.pem')
};



var app = express();

/* app.use(helmet()); */ // Add Helmet as a middleware

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
app.post('/testJSON', function (req, res) {
  if (!req.body) {return res.sendStatus(400)} else {
    const nameText = req.body.Name;
    const vornameText = req.body.Vorname;
    const myObjJSON = { "Name": nameText, "Vorname": vornameText };
    const myObjString = JSON.stringify(myObjJSON);
    const myObjJava = JSON.parse(myObjString);
    const nameJava = myObjJava.Name;
    const vornameJava = myObjJava.Vorname;
    res.send(JSON.stringify(myObjJSON) + " / " + nameJava + " / " + vornameJava);
    // res.send(JSON.stringify(nameJava));
  }
  });

  app.post('/testMongoDb', function (req, res) {
    if (!req.body) {return res.sendStatus(400)} else {
      const dbuser = req.body.dbuser;
      // const dbuser = "jacobc";
      const dbpassword = req.body.dbpassword;
      // const dbpassword = "m2BhR$mla";
      const mongoose = require('mongoose');
      const url = "mongodb://" + dbuser + ":" + dbpassword +"@ds115592.mlab.com:15592/opensesdb";
      // const url = "mongodb://jacobc:m2BhR$mla@ds115592.mlab.com:15592/opensesdb";
      // mongoose.connect('url');
      mongoose.connect(url, {useNewUrlParser: true });
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function() {
        // res.send(JSON.stringify("we're connected!"));
        res.send(JSON.stringify("we're connected!" + " user: " + dbuser + " pw: " + dbpassword));
        // 
      });
      db.close;
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

var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node.js API app listening at http://%s:%s", host, port)

});

https.createServer(options, app).listen(443);
