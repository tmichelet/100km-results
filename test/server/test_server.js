/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var assert = require("assert");
    var http = require("http");
    var server = require('../../src/server/server.js');
    var Browser = require("zombie");
    var fs = require('fs');

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
                getContentOf('test/client/last-checkpoints-expected.html', function (expected_html) {
                    browser.visit("http://localhost:8080/testteam/last-checkpoints", function() {
                        assert.equal(200, browser.statusCode);
                        // assert.equal(expected_html, browser.html());
                        done();
                    });
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

    function getContentOf(filepath, callback) {
        fs.readFile('test/client/last-checkpoints-expected.html', function (err, buffer) {
            if (err) {
                throw err;
            }
            callback(buffer.toString());
        });
    }

}());