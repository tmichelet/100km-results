/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var SRC_PATH = '../../src';

    var assert = require("assert");

    var server = require(SRC_PATH + '/server/server.js');
    var utils = require(SRC_PATH + '/server/utils.js');
    var backend = require(SRC_PATH + '/server/backend.js');


    describe('Backend', function(){
        it('generateCheckpointsHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/last-checkpoints-expected.html', function (expected_html) {
                backend.generateCheckpointsHtml(function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });

        it('generateResultsHtml should generate appropriate html', function(done) {
            utils.getContentOf('test/client/individual-results-expected.html', function (expected_html) {
                backend.generateResultsHtml(function(content) {
                    assert.equal(content, expected_html);
                    done();
                });
            });
        });
    });

}());