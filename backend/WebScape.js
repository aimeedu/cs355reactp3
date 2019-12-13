const Crawler   = require("crawler");
const    Stopwatch = require('statman-stopwatch');


let date = new Date(); // Default value for lastModified if site is missing the required header

let sitesVisited = []; // Array to keep track of visited sites for BFS


// Initial start for method of starting the webscaping
const handleInitialScraping = (startingUrl, limit) =>{

    if (limit <= 0){    // This is set so we don't exceed daily quota of url clicked.
        console.log("Maximum url visitation has been reached.");
        return;
    }


    if (sitesVisited.indexOf(startingUrl) !== -1){
        return;
    }

    sitesVisited.push(startingUrl);


    let stopwatch = new Stopwatch(); // Used to keep track of indexing interval attribute
    let page = {};
    let baseUrl = startingUrl;
    console.log("The url: " + startingUrl);

    stopwatch.start();

// Start of the crawler given the url
    let c = new Crawler({
        callback: (error, res, done)=>{
            let localCounter;
            let globalCounter;
            if (error) {
                console.log(error);
                return;
            } else {
                let hrefs = [];
                let $ = res.$;

                page.title = res.$('h1').text().trim(); // Gets the title tag using h1
                console.log("Page title: \n" + page.title);
                page.url = startingUrl;
                // We need to find the meta tag  that has description and get the content
                page.description = res.$('meta[name="description"]').attr('content'); // Gets the description
                if (page.description != null) {
                    page.description.trim();
                } else{
                    /* If the description is unavailable set the description to the title */
                    page.description = page.title;
                }
                console.log("Page description: \n" + page.description);


                page.lastModified = res.headers["last-modified"]; // Gets the last modified
                if(page.lastModified == null) {             // If last modified is not available we use current time
                    page.lastModified = date;
                }
                console.log("Last time it was modified was: " + page.lastModified)


                let words = [];
                let wordsBucket = $('p').text().split(/\s/g);
                let wordCount = 0;
                wordsBucket.forEach(value => {
                    let sanitizedString;
                    if (value && wordCount < 450) {
                        sanitizedString = value.trim().replace(/[^A-Za-z]/g, '');
                        if (sanitizedString.length > 0) {
                            words.push(sanitizedString);
                        }
                        wordCount++;
                    }
                });

                let wordsFreq = {};
                words.forEach(word => {
                    if (wordsFreq[word]) {
                        wordsFreq[word]++;
                    } else {
                        wordsFreq[word] = 1;
                    }
                });

                page.wordsFreq = wordsFreq;
                console.log(wordsFreq)
                page.words = words;


                localCounter = 0;
                globalCounter = 0;

                $('a').each((index, value) => {
                    let link = $(value).attr('href');
                    if (validLink(link)) {
                        if (isLocal(link) && localCounter < 20) {
                            link = baseUrl + link;
                            hrefs.push(link);
                            localCounter++;
                        } else if (!isLocal(link) && globalCounter < 20) {
                            hrefs.push(link);
                            globalCounter++;
                        }
                    }
                });

                page.timeToIndex = stopwatch.stop();
                console.log("Time Interval was: " + (stopwatch.stopTime-stopwatch.startTime));


                let randomIndex = Math.floor(Math.random() * Math.floor(hrefs.length));
                let nextUrl = hrefs[randomIndex];
                handleInitialScraping(nextUrl, --limit);


            }
            done();

        }
    });

    c.queue(startingUrl);


};




const validLink = (href) =>{
    return href && href.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
};

const isLocal = (href)=>{
    return href.trim().startsWith('/');

};

handleInitialScraping("https://www.pizzahut.com/", 10);
