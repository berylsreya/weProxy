var express = require('express');
var router = express.Router();
var conf = require('config');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var sprintf = require("sprintf-js").sprintf;
var fs = require('fs');
var filename = 'target.json';


router.post('/gettarget', function(req, res) {

    var error;
    var rawQueryString = url.parse(req.url).query;
    var queryParams = querystring.parse(rawQueryString);
    var bod = req.body;
    console.log(sprintf("received payload: [%s]", decodeURIComponent(rawQueryString)));
    var subDomain = bod.subdomain;
     var x;
    if(subDomain in global.map)
    {
     global.pool.acquire(function(err, client) {
             if (err) {
             error = err;
                 // handle error - this is generally the err from your
                 // factory.create function
             }
             else {
                 client.query("select target from target_map where subdomain = ?",[subDomain], function(err , result) {
                     // return object back to pool
                     console.log(err);
                     error = err;
                     console.log("result :" +result);
                     setRes(result[0].target);
                     pool.release(client);
                 });
             }
         });

//     res.status(200).json({ status : "Success",
//                               Data : {Target : x},
//                               Error : error }).end();
    }



    else {
            res.status(200).json({ status : "Failed",
                                   Data : {},
                                   Error : "SubDomain not Found" }).end();

        }

    function setRes(x) {
             res.status(200).json({ status : "Success",
                                            Data : {Target : x},
                                            Error : error }).end();

        }

    });


// Module Exports
module.exports = router;
