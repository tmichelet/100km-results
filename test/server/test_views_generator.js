/*global describe, it */

(function () {
    "use strict";

    var SRC_PATH = '../../src';

    var assert = require("assert");

    var utils = require(SRC_PATH + '/server/utils.js');
    var viewsGenerator = require(SRC_PATH + '/server/views_generator.js');

    describe('Views Generator', function() {
        describe('_testteam', function() {
            it('generateCheckpointsHtml should generate appropriate html', function(done) {
                utils.getContentOf('test/client/last-checkpoints-expected.html', function (expected_html) {
                    viewsGenerator.generateCheckpointsHtml("_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });

            it('generateResultsHtml should generate appropriate html', function(done) {
                utils.getContentOf('test/client/individual-results-expected.html', function (expected_html) {
                    viewsGenerator.generateResultsHtml("_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });

            it('generateIndexHtml should generate appropriate html', function(done) {
                utils.getContentOf('test/client/index-expected.html', function (expected_html) {
                    viewsGenerator.generateIndexHtml("_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });

        describe('_testalone', function(){
            it('generateResultsHtml should generate appropriate html', function(done) {
                utils.getContentOf('test/client/individual-results-expected-alone.html', function (expected_html) {
                    viewsGenerator.generateResultsHtml("_testalone", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
            it('generateIndexHtml should generate appropriate html', function(done) {
                utils.getContentOf('test/client/index-expected-alone.html', function (expected_html) {
                    viewsGenerator.generateIndexHtml("_testalone", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });

        describe('_testwrong', function(){
            it('generateIndexHtml should generate link to team creation html', function(done) {
                viewsGenerator.generateIndexHtml("_testwrong", function(content) {
                    assert.equal(content, "link to create a team");
                    done();
                });
            });
        });
    });

}());