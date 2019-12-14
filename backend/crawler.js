const Crawler = require("js-crawler");
const crawler = new Crawler().configure({
    depth: 2,


});

crawler.crawl("https://www.wikipedia.org/", function(page) {
    console.log(page.url);
});