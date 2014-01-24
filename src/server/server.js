/*global console */

(function() {
    "use strict";

    var express = require('express');
    var app = express();
    var server;

    function serveFiles(callback) {
        app.get('/', function(req, res){
            res.send('Hello World');
        });
        app.get('/testteam/last-checkpoints', function(req, res){
            res.send('Hello World');
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
