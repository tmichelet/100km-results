/*global console */

(function() {
    "use strict";

    var express = require('express');
    var app = express();
    var Handlebars = require('Handlebars');
    var server;

    var utils = require('./utils.js');
    var resultsViewsGenerator = require('./views_generator.js');
    var database = require('./database.js');
    

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

        app.get('/:name/edit/:bibs', function(req, res){
            database.saveTeam(req.params.name, req.params.bibs, function() {
                res.send('OK');
            });
        });
        callback();
    }

    exports.start = function(databasePath, callback) {
        if(arguments.length === 1) { //TODO test this
            callback = arguments[0];
            databasePath = null;
        }
        server = app.listen(8080);
        database.initDB(databasePath, function() {
            serveFiles(callback);
        });
    };

    exports.stop = function(callback) {
        server.close();
        callback();
    };

}());
