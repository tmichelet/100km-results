/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var SRC_PATH = '../../src';

    var assert = require("assert");
    var http = require("http");
    var Browser = require("zombie");
    var fs = require('fs');

    var server = require(SRC_PATH + '/server/server.js');
    var utils = require(SRC_PATH + '/server/utils.js');


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

        //TODO uncomment, update index.html
        describe('Get /testteam', function(){
            it('should return the expected html', function(done){
                var browser = new Browser();
                utils.getContentOf('test/client/index-expected.html', function (expected_html) {
                    browser.visit("http://localhost:8080/testteam", function() {
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

}());