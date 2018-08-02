"use strict";

const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('underscore');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

var gaScripts = ["ga.js", "dc.js", "analytics.js", "gtag.js", "gatag.js", "ga_exp.js", "gtm.js"];
var returnObj;

function findScript(arr, arrLen1, arrLen2) {
    var analytics = false;
    var script_arr = [];

    for(var x = 0; x < arrLen1; x++) {
        if(arr[x].attribs.src != undefined) {
            script_arr.push(arr[x].attribs.src);
        }
    }

    var scriptArrLen = script_arr.length;

    for(var i = 0; i < scriptArrLen - 1; i++){
        for(var j = 0; j < arrLen2; j++){
            if(script_arr[i].indexOf(gaScripts[j]) !== -1) {
                analytics = true;
            }
        }
    }

    return analytics;
}

// @route POST /:url
// @desc sends the URL of the site you want to Scrape
// @access public
app.post("/url", (req, res) => {
    var url = req.body.url;

    console.log(url);

    request.get(url, (error, response, html) => {

        var $ = cheerio.load(html);

        var title = $('title').text();

        var links = $('a');

        var unique_links = _.uniq(links);

        var scripts = $('script');
        var script_length = scripts.length;
        var analytics_length = gaScripts.length;

        var analytics = findScript(scripts, script_length, analytics_length);

        var connectionSecure, connectionEncrypted, socketSecure, socketEncrypted;
        connectionSecure = response.connection._secureEstablished;
        connectionEncrypted = response.connection.encrypted;
        socketSecure = response.socket._secureEstablished;
        socketEncrypted = response.socket.encrypted;

        returnObj = {
            title: title,
            links: links.length,
            unique_links: unique_links.length,
            hasAnalyitics: analytics,
            connectionSecure: connectionSecure,
            connectionEncrypted: connectionEncrypted,
            socketSecure: socketSecure,
            socketEncrypted: socketEncrypted
        }

        console.log(returnObj);
        return res.status(200).json(returnObj);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('The server is listening on port: ', port));
