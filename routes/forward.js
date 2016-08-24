var express = require('express');
var router = express.Router();
var conf = require('config');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var sprintf = require("sprintf-js").sprintf;
var fs = require('fs');
var filename = 'target.json';
var httpProxy = require("http-proxy");
var http = require('http');



var apiProxy = httpProxy.createProxyServer();


router.all('/', function (req, res){

    console.log(req.headers['host']);
    var targeturl;
    var rawQueryString = url.parse(req.url).query;
    var queryParams = querystring.parse(rawQueryString);
    var proxyurl;
    var domain = req.headers.host,
        subDomain = domain.split('.');
    if(subDomain.length > 1){
        subDomain = subDomain[0];

    global.pool.acquire(function(err, client) {
       if (err) {
           error = err;
       }
       else {
           client.query("select target from target_map where subdomain = ?",[subDomain], function(err , result) {
                // return object back to pool
                console.log(err);
                error = err;
                console.log("setting result : " + JSON.stringify(result) );
                if(result.length == 0){
                res.status(400).json({Error: "No such subDomain"}).end();
                }
                else{
                pool.release(client);
//                apiProxy.web(req, res, { target: result[0].target });
                if(rawQueryString != null)
                proxyurl = result[0].target+"?"+rawQueryString;

                else
                proxyurl = result[0].target;

                apiProxy.web(req, res, {
                            target: proxyurl,
                            changeOrigin: true,
                            ignorePath: true

                           });

                      }
                })
            }
        });

     }
         else {
         console.log("subd : "+subDomain);
         res.render('index.pug',
           { title : 'Set Target',
             title2 : 'Get Target'  }
           );

         }


});


module.exports = router;