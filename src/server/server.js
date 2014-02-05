/*global console */

(function() {
    "use strict";

    var express = require('express');
    var app = express();
    var Handlebars = require('handlebars');
    var server;

    var utils = require('./utils.js');
    var resultsViewsGenerator = require('./views_generator.js');
    var database = require('./database.js');

    function serveFiles(callback) {
        app.get('/_status', function(req, res){
            res.send('OK');
        });

        app.use("/_build", express.static('src/client/build'));
        app.use("/_lib", express.static('src/client/lib'));

        app.get('/', function(req, res){
            resultsViewsGenerator.generateHtml('root', null, function (data) {
                res.send(data);
            });
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

    var log = function(path, req) {
        utils.log(path, [
                req.method, req.url, req.connection.remoteAddress,
                req.headers['user-agent'], req.headers.referer
            ].join(' # ')
        );
    };

    exports.start = function(options, callback) {
        if(arguments.length === 1) {
            callback = arguments[0];
            options = utils.defaultOptions;
        }

        app.use(function(req, res, next) {
            if(req.url.substr(-1) === '/' && req.url.length > 1) {
                res.redirect(301, req.url.slice(0, -1));
            }
            else {
                log(options.logfilePath ,req);
                next();
            }
        });
        server = app.listen(options.port);
        database.initDB(options.databasePath, function() {
            serveFiles(callback);
        });
    };

    exports.stop = function(callback) {
        server.close();
        callback();
    };

}());
