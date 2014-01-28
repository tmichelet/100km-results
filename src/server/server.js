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
        app.get('/:teamname', function(req, res){
            resultsViewsGenerator.generateIndexHtml(req.params.teamname, function (data) {
                res.send(data);
            });
        });

        app.get('/:teamname/edit', function(req, res){
            resultsViewsGenerator.generateHtml('teamEdit', req.params.teamname, function (data) {
                res.send(data);
            });
        });

        app.get('/:teamname/edit/:bibs/:names', function(req, res){
            database.saveTeam(req.params.teamname, req.params.bibs, req.params.names, function() {
                res.send('OK');
            });
        });
        callback();
    }

    exports.start = function(databasePath, callback) {
        if(arguments.length === 1) { //TODO test this with a mock
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
