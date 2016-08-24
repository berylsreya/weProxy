var express = require("express");
var path = require('path');
var fs = require('fs');
var conf = require('config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');
var sprintf = require("sprintf-js").sprintf;
var httpProxy = require("http-proxy");
var http = require('http');
var fs = require('fs');
var filename = 'target.json';
var mysql = require('mysql');
var Pool = require('generic-pool').Pool;

global.appRoot = path.resolve(__dirname);

var PORT = conf.get('port');
var app = express();

console.log(sprintf("using env: [%s]", app.get('env')));
app.set('view engine', 'html') ;
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret : "123456",
    saveUninitialized: true,
    resave : false
}));
 var x;


//
//var obj;
//var contents = fs.readFileSync(filename);
//    contents = JSON.parse(contents);
//    console.log("OBJ : " + contents.url);
//    httpProxy.createProxyServer({target:contents.url}).listen(8000);
//
//
http.createServer(function (req, res) {
  res.end(JSON.stringify(req.headers, true, 2));
}).listen(9000);


global.pool = new Pool({
    name     : 'mysql',
    create   : function(callback) {
        var c = mysql.createConnection({
                user: 'root',
                password: '',
                database:'node_proxy_server'
        })

        // parameter order: err, resource
        callback(null, c);
    },
    destroy  : function(client) { client.end(); },
    max      : 10,
    // optional. if you set this, make sure to drain() (see step 3)
//    min      : 2,
    // specifies how long a resource can stay idle in pool before being removed
//    idleTimeoutMillis : 30000,
     // if true, logs via console.log - can also be a function
    log : true
});
global.map = {};
pool.acquire(function(err, client) {
    if (err) {
        // handle error - this is generally the err from your
        // factory.create function
    }
    else {
        client.query("select * from target_map", function(err , result) {
            // return object back to pool
            console.log("app.js result :" +result);
            setValue(result);
            pool.release(client);
        });
    }
});

module.export = map;


var tar = require('./routes/seturl');
app.use(tar);

var temp = require('./routes/forward');
app.use(temp);


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log("\n" + err);

        //res.status(err.status || 500);
        // res.json({
        //     "message": err.message || '',
        //     "error": err,
        //     "stackTrace": err.stack
        // });
    });
}

app.use(function(err, req, res, next) {
    console.log("\n" + err);

    //res.status(err.status || 500);
    // res.json({
    //     "message": err.message || '',
    //     "error": {},
    //     "stackTrace": err.stack
    // });
});

function setValue(value) {
     for(var i = 0; i < value.length; i++) {
          global.map[value[i].subdomain] = value[i].target;
      }
  console.log("map setting :"+JSON.stringify(global.map));
}

app.listen(PORT) ;
console.log(sprintf('Listening on port %s...', PORT));
