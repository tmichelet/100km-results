/*global console */

(function() {
    "use strict";

    var express = require('express');
    var app = express();
    var Handlebars = require('Handlebars');
    var server;

    var utils = require('./utils.js');
    var resultsViewsGenerator = require('./views_generator.js');
    

    function serveFiles(callback) {
        app.get('/', function(req, res){
            res.send('Hello World');
        });
        app.get('/:name', function(req, res){
            resultsViewsGenerator.generateIndexHtml(req.params.name, function (data) {
                res.send(data);
            });
        });

        app.get('/:name/edit', function(req, res){
            resultsViewsGenerator.generateHtml('teamEdit', req.params.name, function (data) {
                res.send(data);
            });
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

}());
