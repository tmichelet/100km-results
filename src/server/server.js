/*global console */

(function() {
    "use strict";

    var express = require('express');
    var app = express();
    var Handlebars = require('Handlebars');
    var server;
    

    function serveFiles(callback) {
        app.get('/', function(req, res){
            res.send('Hello World');
        });
        app.get('/testteam/last-checkpoints', function(req, res){
            res.send(generateCheckpointsHtml());
        });
        callback();
    }

    exports.start = function(callback) {
        server = app.listen(8080);
        serveFiles(callback);
    };

    exports.stop = function(callback) {
        server.close();
        callback();
    };

    // function retrieveData() {
    //     var mockedData = require('../../test/client/mocked-data.js');
    //     return mockedData.getAllPersons();
    // }

    function generateCheckpointsHtml() {
        var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
             "{{kids.length}} kids:</p>" +
             "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
        var template = Handlebars.compile(source);

        var data = { "name": "Alan", "hometown": "Somewhere, TX",
                     "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
        var result = template(data);

        return result;
    }

}());
