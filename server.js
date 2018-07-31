const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('underscore');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

var gAnalyiticsScripts = ["ga.js", "dc.js", "analytics.js", "gtag.js", "ga_exp.js", "gtm.js"];

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

var url = "https://ca.gov/"

request.get(url, (error, response, html) => {
    if(error) console.log('There was an error processing your request: ', error);
    var analytics = false;

    var $ = cheerio.load(html);

    var title = $('title').text();
    console.log('Title: ', title);

    var links = $('a');
    console.log("Number of links: " + links.length);

    var unique_links = _.uniq(links);
    console.log("Number of unique links: ", unique_links.length);

    var scripts = $('script');

    scripts.each((i) => {
        gAnalyiticsScripts.each((j) => {
            if(scipts[i].includes(gAnalyiticsScripts[j])) {
                analytics = true;
            }
        });
    });

    $(scripts).each((i, script) => {
        console.log($(script).text() + " : " + $(script).attr('src'));
    });

    // $(links).each((i, link) => {
    //     console.log($(link).text() + ":\n" + $(link).attr('href'));
    // });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('The server is listening on port: ', port));
