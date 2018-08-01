"use strict";

const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('underscore');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

var gaScripts = ["ga.js", "dc.js", "analytics.js", "gtag.js", "ga_exp.js", "gtm.js"];

function findScript(arr, arrLen1, arrLen2) {
    var analytics = false;
    var script_arr = [];

    for(var x = 0; x < arrLen1; x++) {
        script_arr.push(arr[x].attribs.src);
        console.log(arr[x].attribs.src);
    }


    var analytics_check = new Promise((resolve, reject) => {
        for(var i = 0; i < arrLen1; i++){
            for(var j = 0; j < arrLen2; ){
                if(script_arr[i].indexOf(gaScripts[j]) !== -1) {
                    analytics = true;
                }
            }
        }
        console.log(analytics);
        resolve(analytics);
    });

    return analytics_check;
}

// @route GET /:url
// @desc sends the URL of the site you want to Scrape
// @access public
app.get("/:url", (req, res) => {
    var url = req.params.url;

    request.get(url, (error, response, html) => {
        if(error) console.log('There was an error processing your request: ', error);

        var $ = cheerio.load(html);

        var title = $('title').text();
        console.log(title);
    });
});

var url = "https://jessedavda.github.io/"

request.get(url, (error, response, html) => {
    if(error) console.log('There was an error processing your request: ', error);

    var $ = cheerio.load(html);

    var title = $('title').text();
    console.log('Title: ', title);

    var links = $('a');
    console.log("Number of links: " + links.length);

    var unique_links = _.uniq(links);
    console.log("Number of unique links: ", unique_links.length);

    var scripts = $('script');
    var script_length = scripts.length;
    var analytics_length = gaScripts.length;

    findScript(scripts, script_length, analytics_length)
        .then(analytics => {
            console.log("response: ", analytics);
            console.log("wqooqdqfqefe");
        })
        .catch(e => {
            console.log(e);
        });

    // var titles = $("h1");
    // console.log(titles.text());
    //
    $(scripts).each((i, script) => {
        console.log($(script).text() + " : " + $(script).attr('src'));
    });
    //
    // $(links).each((i, link) => {
    //     console.log($(link).text() + ":\n" + $(link).attr('href'));
    // });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('The server is listening on port: ', port));
