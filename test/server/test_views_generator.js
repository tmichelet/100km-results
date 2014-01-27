/*global describe, it */

(function () {
    "use strict";

    var SRC_PATH = '../../src';

    var assert = require("assert");

    var utils = require(SRC_PATH + '/server/utils.js');
    var viewsGenerator = require(SRC_PATH + '/server/views_generator.js');

    describe('Views Generator - Results', function() {
        describe('_testteam', function() {
            it('should generate checkpoints html', function(done) {
                utils.getContentOf('test/client/last-checkpoints-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('checkpoints', "_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });

            it('should generate results html', function(done) {
                utils.getContentOf('test/client/individual-results-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('results', "_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });

            it('should generate index html', function(done) {
                utils.getContentOf('test/client/index-expected.html', function (expected_html) {
                    viewsGenerator.generateIndexHtml("_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });

        describe('_testalone', function(){
            it('should generate results html', function(done) {
                utils.getContentOf('test/client/individual-results-expected-alone.html', function (expected_html) {
                    viewsGenerator.generateHtml('results', "_testalone", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
            it('should generate index html', function(done) {
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
                utils.getContentOf('test/client/team-not-found-expected.html', function (expected_html) {
                    viewsGenerator.generateIndexHtml("_testwrong", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });
    });

    describe('Views Generator - Team edition', function() {
        describe('_testteam/edit', function() {
            it('should generate team edition html', function(done) {
                utils.getContentOf('test/client/team-edit-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('teamEdit', "_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });
    });

}());
