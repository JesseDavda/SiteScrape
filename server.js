"use strict";

const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('underscore');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

//Array of script names used by google analytics
var gaScripts = ["ga.js", "dc.js", "analytics.js", "gtag.js", "gatag.js", "ga_exp.js", "gtm.js"];
var returnObj;

//function that finds whether the page has google analytics enabled
function findScript(arr, arrLen1, arrLen2) {
    var analytics = false;
    var script_arr = [];

    //creating an array of script names from a JSON object array
    for(var x = 0; x < arrLen1; x++) {
        if(arr[x].attribs.src != undefined) {
            script_arr.push(arr[x].attribs.src);
        }
    }

    var scriptArrLen = script_arr.length;

    //Looping through all of the script names and checking them against the known google analytics script names
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

    //requesting the webpage
    request.get(url, (error, response, html) => {
        //loading the html data returned into a cheerio object to scrape it
        const $ = cheerio.load(html);

        const title = $('title').text();

        const links = $('a');

        //using the underscore libary to make sure the array of links doesnt have any duplicates
        const unique_links = _.uniq(links);

        const scripts = $('script');
        const script_length = scripts.length;
        const analytics_length = gaScripts.length;

        //calling the function to find whether the page has google analytics
        const analytics = findScript(scripts, script_length, analytics_length);

        //checking that the socket and the connection are secure and both are encrypted
        var connectionSecure, connectionEncrypted, socketSecure, socketEncrypted;
        connectionSecure = response.connection._secureEstablished;
        connectionEncrypted = response.connection.encrypted;
        socketSecure = response.socket._secureEstablished;
        socketEncrypted = response.socket.encrypted;

        returnObj = {
            title: title,
            links: links.length,
            unique_links: unique_links.length,
            hasAnalytics: analytics,
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
