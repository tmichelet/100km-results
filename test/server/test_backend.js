/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var SRC_PATH = '../../src';

    var assert = require("assert");

    var server = require(SRC_PATH + '/server/server.js');
    var utils = require(SRC_PATH + '/server/utils.js');
    var backend = require(SRC_PATH + '/server/backend.js');
    var mockedData = require('./_mocked-data.js');


    describe('Backend - HTML - _testteam', function(){
        it('generateCheckpointsHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/last-checkpoints-expected.html', function (expected_html) {
                backend.generateCheckpointsHtml("_testteam", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });

        it('generateResultsHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/individual-results-expected.html', function (expected_html) {
                backend.generateResultsHtml("_testteam", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });

        it('generateIndexHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/index-expected.html', function (expected_html) {
                backend.generateIndexHtml("_testteam", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });
    });

    describe('Backend - HTML - emeline L', function(){
        it('generateResultsHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/individual-results-expected-alone.html', function (expected_html) {
                backend.generateResultsHtml("_testalone", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });
        it('generateIndexHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/index-expected-alone.html', function (expected_html) {
                backend.generateIndexHtml("_testalone", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });
    });

    describe('Backend - Retrieve Data', function(){
        it('should retrieve two persons for _testteam', function(done) {
            assertJsonEqual(mockedData.getAllPersons(), backend.retrieveData("_testteam"));
            done();
        });
        it('should retrieve one person for _testalone', function(done) {
            assertJsonEqual(mockedData.getEmelineL(), backend.retrieveData("_testalone"));
            done();
        });
    });

    function assertJsonEqual(j1, j2) {
        return assert.equal(JSON.stringify(j1), JSON.stringify(j2));
    }

}());