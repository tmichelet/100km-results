/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var SRC_PATH = '../../src';

    var assert = require("assert");

    var server = require(SRC_PATH + '/server/server.js');
    var utils = require(SRC_PATH + '/server/utils.js');
    var backend = require(SRC_PATH + '/server/backend.js');
    var mockedData = require('./_mocked-data.js');


    describe('Backend - HTML - testteam', function(){
        it('generateCheckpointsHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/last-checkpoints-expected.html', function (expected_html) {
                backend.generateCheckpointsHtml("testteam", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });

        it('generateResultsHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/individual-results-expected.html', function (expected_html) {
                backend.generateResultsHtml("testteam", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });

        it('generateIndexHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/index-expected.html', function (expected_html) {
                backend.generateIndexHtml("testteam", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });
    });

    describe('Backend - HTML - emeline L', function(){
        it('generateResultsHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/individual-results-expected-alone.html', function (expected_html) {
                backend.generateResultsHtml("testalone", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });
        it('generateIndexHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/index-expected-alone.html', function (expected_html) {
                backend.generateIndexHtml("testalone", function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });
    });

    describe('Backend - Retrieve Data', function(){
        it('should retrieve two persons for testteam', function(done) {
            assertJsonEqual(mockedData.getAllPersons(), backend.retrieveData("testteam"));
            done();
        });
        it('should retrieve one person for testalone', function(done) {
            assertJsonEqual(mockedData.getEmelineL(), backend.retrieveData("testalone"));
            done();
        });
    });

    function assertJsonEqual(j1, j2) {
        return assert.equal(JSON.stringify(j1), JSON.stringify(j2));
    }

}());