/*global console */

(function() {
    "use strict";

    var http = require("http");

    http.createServer(function(request, response) {
        console.log(request.url);
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        response.setHeader('Access-Control-Allow-Credentials', 'true');
        response.write(JSON.stringify(fileContent(request.url)));
        response.end();
    }).listen(5984);


    var fileContent = function(uri) {
        var jsonResponse = null;
        switch (uri) {
            // checkpoints
            case "/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B100%2Cnull%5D&endkey=%5B100%2C4%5D&inclusive_end=false":
                jsonResponse = {"rows":[{"key":[100,1,1],"value":1390337566986},{"key":[100,1,2],"value":1390337584343},{"key":[100,2,1],"value":1390338757392}]};
                break;

            case "/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B40%2Cnull%5D&endkey=%5B40%2C4%5D&inclusive_end=false":
                jsonResponse = {"rows":[{"key":[40,1,1],"value":1390337566986},{"key":[40,1,2],"value":1390338257392}]};
                break;

            // bibs
            case "/steenwerck100km/contestant-40":
                jsonResponse = {"_id":"contestant-40","first_name":"Emeline","name":"LANDEMAINE","wrong":"wrong"};
                break;
            // names
            case "/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22emel%22&endkey=%22emel%EF%BF%B0%22":
                jsonResponse = {"rows":[{"value":{"first_name":"Emeline","name":"PARIZEL","bib":100}},{"value":{"first_name":"Emeline","name":"LANDEMAINE","bib":40}}]};
                break;

            case "/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22emeline%22&endkey=%22emeline%EF%BF%B0%22&term=land":
                jsonResponse = {"rows":[{"value":{"first_name":"Emeline","name":"LANDEMAINE","bib":40, "wrong":"wrong"}}]};
                break;

            default:
                jsonResponse = {"total_rows":4,"offset":0,"rows":[]};
                break;
        }
        return jsonResponse;
    };
}());
