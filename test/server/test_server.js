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
        describe('Lifecycle', function(){
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
        });

        describe('Get', function(){
            it('/_testteam should return a 200', function(done){
                var browser = new Browser();
                browser.visit("http://localhost:8080/_testteam", function() {
                    assert.equal(200, browser.statusCode);
                    done();
                });
            });
            it('/_testalone should return a 200', function(done){
                var browser = new Browser();
                browser.visit("http://localhost:8080/_testalone", function() {
                    assert.equal(200, browser.statusCode);
                    done();
                });
            });
            it('/testwrong should link to team creation', function(done){
                var browser = new Browser();
                browser.visit("http://localhost:8080/testwrong", function() {
                    assert.equal(200, browser.statusCode);
                    assert.equal("link to create a team", browser.text("body"));
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