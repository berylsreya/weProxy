var express = require('express');
var router = express.Router();
var conf = require('config');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var sprintf = require("sprintf-js").sprintf;
var fs = require('fs');
var filename = 'target.json';


router.post('/settarget', function(req, res) {

    var error;
    var rawQueryString = url.parse(req.url).query;
    var queryParams = querystring.parse(rawQueryString);
    var bod = req.body;
    console.log(sprintf("received payload: [%s]", decodeURIComponent(rawQueryString)));
    var subDomain = bod.subdomain;
    var set = bod.target;

    if(subDomain in global.map){
    global.pool.acquire(function(err, client) {
        if (err) {
        error = err;
            // handle error - this is generally the err from your
            // factory.create function
        }
        else {
            client.query("update target_map SET target= ? where subdomain = ?",[set,subDomain], function(err , result) {
                // return object back to pool
                console.log(err);
                error = err;
                console.log("result :" +result);
                pool.release(client);
            });

            global.map[subDomain] = set;
        }
    });



   } else {

   global.pool.acquire(function(err, client) {
           if (err) {
               error = err;
           }
           else {
               client.query("insert into target_map (subdomain, target) values (?,?)",[subDomain, set], function(err , result) {
                   // return object back to pool
                   console.log(err);
                   error = err;
                   console.log("res : " +result);
                   pool.release(client);
               });
               global.map[subDomain] = set;
           }
       });

   }

var x = JSON.stringify(global.map[subDomain]);
if(map[subDomain].localeCompare(set)==0)
  {
    res.status(200).json({ status : "Success",
                           Data : {SetTarget : x},
                           Error : error }).end();
                           }
else {
    res.status(200).json({ status : "Failed",
                           Data : {},
                           Error : error }).end();

}
});


// Module Exports
module.exports = router;
