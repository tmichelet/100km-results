/*global describe, it, before, after */

(function () {
    "use strict";

    var assert = require("assert");
    var http = require("http");
    var Browser = require("zombie");
    var fs = require('fs');

    var test_utils = require('./test_utils.js');
    var server = require(test_utils.SRC_PATH + '/server/server.js');
    var utils = require(test_utils.SRC_PATH + '/server/utils.js');
    var database = require(test_utils.SRC_PATH + '/server/database.js');

    describe('Server', function(){

        describe('Lifecycle', function(){
            it('should start and stop properly, linked to the right database', function(done) {
                checkServerIs('down', function() {
                    server.start(test_utils.testOptions, function() {
                        test_utils.assertJsonEqual(test_utils.testOptions.databasePath, database.DB.client.connectionSettings.filename);
                        checkServerIs('up', function() {
                            server.stop(function() {
                                checkServerIs('down', done);
                            });
                        });
                    });
                });
            });

            it('should return CONNREFUSED when not started', function(done){
                http.get("http://localhost:8080/_status", function(res) {
                    assert.ok(false, 'get should retrieve an error');
                }).on('error', function(e) {
                    assert.equal("connect ECONNREFUSED", e.message);
                    done();
                });
            });
        });

        describe('Serving', function() {
            before(function(done) {
                server.start(test_utils.testOptions, function() {
                    test_utils.initAndFillDatabase(function() {done();});
                });
            });
            after(function(done) {
                test_utils.dropDatabase(function() {
                    server.stop(function() {
                        done();
                    });
                });
            });

            describe('Get main view', function(){
                it("/_testteam/ with a trailing '/' should return a 301 and not log", function(done){
                    fs.writeFile(test_utils.testOptions.logfilePath, '', function() {
                        http.get(getOptions("/_testteam/"), function(res) {
                            assert.equal(301, res.statusCode);
                            fs.readFile(test_utils.testOptions.logfilePath, 'utf8', function(err, data) {
                                assert.equal("", data);
                                done();
                            });
                        });
                    });
                });
                it('/_testteam should return a 200 and log', function(done){
                    fs.writeFile(test_utils.testOptions.logfilePath, '', function() {
                        var browser = new Browser();
                        browser.visit("http://localhost:8080/_testteam", function() {
                            assert.equal(200, browser.statusCode);
                            assert.equal('http://localhost:8080/_testteam/edit', browser.document.querySelector("a").href);
                            fs.readFile(test_utils.testOptions.logfilePath, 'utf8', function(err, data) {
                                assert.equal("GET /_testteam\n", data);
                                done();
                            });
                        });
                    });
                });
                it('/_testalone should return a 200', function(done){
                    var browser = new Browser();
                    browser.visit("http://localhost:8080/_testalone", function() {
                        assert.equal(200, browser.statusCode);
                        assert.equal('http://localhost:8080/_testalone/edit', browser.document.querySelector("a").href);
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

            describe('Get sub views', function() {
                it('/_testteam/edit should return a 200', function(done){
                    http.get(getOptions("/_testteam/edit"), function(res) {
                        assert.equal(200, res.statusCode);
                        //TODO some user actions here
                        done();
                    });
                });
                it('/_testteam/edit/[4]/[name one] should update the team bibs', function(done){
                    http.get(getOptions("/_testteam/edit/[4]/[nameOne]"), function(res) {
                        database.getTeam("_testteam", function(data) {
                            test_utils.assertJsonEqual({ teamname: '_testteam', bibs: '[4]', names: '[nameOne]' }, data);
                            done();
                        });
                    });
                });

                it('/_build/all-teams.js should return a 200', function(done){
                    http.get(getOptions("/_build/all-teams.js"), function(res) {
                        assert.equal(200, res.statusCode);
                        assert.equal('application/javascript', res.headers['content-type']);
                        done();
                    });
                });
                it('/_build/edit-team.js should return a 200', function(done){
                    http.get(getOptions("/_build/edit-team.js"), function(res) {
                        assert.equal(200, res.statusCode);
                        assert.equal('application/javascript', res.headers['content-type']);
                        done();
                    });
                });

                it('/ should return a 200', function(done){
                    http.get(getOptions(""), function(res) {
                        assert.equal(200, res.statusCode);
                        //TODO some user actions here
                        done();
                    });
                });
            });
        });
    });

    function getOptions(path) {
        return {hostname:'localhost', port:8080, path:path, agent:false};
    }

    function checkServerIs(status, callback) {
        http.get("http://localhost:8080/_status", function(res) {
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
