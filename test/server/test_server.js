/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var assert = require("assert");
    var http = require("http");
    var server = require('../../src/server/server.js');
    var Browser = require("zombie");

    beforeEach(function() {
        server.start(function() {});
    });

    afterEach(function() {
        server.stop(function() {});
    });


    describe('Server', function(){
        it('should start and stop properly', function(done) {
            checkServerIs('up', function() {
                server.stop(function() {
                    checkServerIs('down', function() {
                        server.start(function() {
                            checkServerIs('up', done);
                        });
                    });
                });
            });
        });

        it('should return CONNREFUSED when not started', function(done){
            server.stop(function() {
                http.get("http://localhost:8080/", function(res) {
                    assert.ok(false, 'get should retrieve an error');
                }).on('error', function(e) {
                    assert.equal("connect ECONNREFUSED", e.message);
                    server.start(function() {
                        done();
                    });
                });
            });
        });


        describe('Get /testteam/last-checkpoints', function(){
            it('should return the expected html', function(done){
                var browser = new Browser();
                browser.visit("http://localhost:8080/testteam/last-checkpoints")
                .then(function () {
                    assert.equal(200, browser.statusCode);
                    assert.equal("<html><head></head><body>Hello World</body></html>", browser.html());
                    done();
                });
            });
        });
    });

    function checkServerIs(status, callback) {
        http.get("http://localhost:8080/", function(res) {
            if(status === 'up') {
                callback();
            }
            else {
                assert.ok(false, 'server should be down');
            }
        }).on('error', function(e) {
            if(status === 'down') {
                callback();
            }
            else {
                assert.ok(false, 'server should be up');
            }
        });
    }

}());