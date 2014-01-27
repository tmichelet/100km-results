/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var SRC_PATH = '../../src';
    var TEST_DATABASE = './100km-tests.sqlite';

    var assert = require("assert");
    var http = require("http");
    var Browser = require("zombie");
    var fs = require('fs');

    var server = require(SRC_PATH + '/server/server.js');
    var utils = require(SRC_PATH + '/server/utils.js');
    var database = require(SRC_PATH + '/server/database.js');


    beforeEach(function(done) {
        server.start(function() {done();});
    });

    afterEach(function(done) {
        server.stop(function() {done();});
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

        describe('Get main view', function(){
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
            it('/_testwrong should link to team creation', function(done){
                var browser = new Browser();
                browser.visit("http://localhost:8080/_testwrong", function() {
                    assert.equal(200, browser.statusCode);
                    assert.equal('http://localhost:8080/_testwrong/edit', browser.document.querySelector("a").href);
                    done();
                });
            });
        });

        describe('Edit team', function(){
            it('/_testteam/edit should return a 200', function(done){
                var browser = new Browser();
                browser.visit("http://localhost:8080/_testteam/edit", function() {
                    assert.equal(200, browser.statusCode);
                    done();
                });
            });
            // it('/_testteam/edit/[4] should update the team bibs', function(done){
            //     database.createDB(TEST_DATABASE, function() {
            //         database.saveTeam("_testteam", "[4,100]", function() {
            //             var browser = new Browser();
            //             browser.visit("http://localhost:8080/_testteam/edit/[4]", function() {
            //                 database.getTeam("_testteam", function(data) {
            //                     console.log(data);
            //                     database.dropDB(TEST_DATABASE, function() {done();});
            //                 });
            //             });
            //         });
            //     });
            // });
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