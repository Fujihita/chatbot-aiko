var https = require('https');
var WebSearch = {};

WebSearch.lookup = function (query, handler) {
    https.get({
        hostname: 'api.cognitive.microsoft.com',
        path: '/bing/v5.0/search?q=' + encodeURIComponent(query) + '&count=20&mkt=en-us&safesearch=Strict&responseFilter=WebPages',
        headers: {
            'Ocp-Apim-Subscription-Key': (process.env.BING_WEB_SEARCH_API_KEY),
            'Accept': 'application/json',
        }
    }, (res) => {
        var body = '';
        res.on('data', function (chunk) { body += chunk; });
        res.on('end', function () {

            if (typeof (JSON.parse(body).queryContext) != 'undefined')
                handler("Yikes! Too lewd!");
            else {
                try {
                    findFeatureSnippet((JSON.parse(body)).webPages.value, handler);
                }
                catch (err) {
                    handler("I cannot find any result");
                    console.log(err);
                    console.log(body);
                }
            }
            });
    });
}

function findFeatureSnippet(resultArray, handler) {
    var result = resultArray.filter(domainFilter);
    if (result.length > 0) {
        handler(result[0].snippet + ' (Source: ' + result[0].displayUrl + ' )');
    }
    else {
        handler(resultArray[0].snippet + ' (Source: ' + resultArray[0].displayUrl + ' )');
    }
}

function domainFilter(result) {
    var safeDomainList = [
        'en.wikipedia.org',
        'en.wiktionary.org',
        'www.thefreedictionary.com',
        'www.dictionary.com',
        'myanimelist.net',
        'kancolle.wikia.com',
        'merriam-webster.com'
    ];
    var domain = extractDomain(result.displayUrl);
    return (safeDomainList.indexOf(domain) > -1)
}

function snippetFilter(result, searchPharse) {
    return new RegExp('\\b' + myWord + '\\b').test(result.snippet);
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

module.exports = WebSearch;