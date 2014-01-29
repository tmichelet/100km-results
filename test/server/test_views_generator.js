/*global describe, it, before, after */

(function () {
    "use strict";

    var assert = require("assert");

    var test_utils = require('./test_utils.js');
    var utils = require(test_utils.SRC_PATH + '/server/utils.js');
    var viewsGenerator = require(test_utils.SRC_PATH + '/server/views_generator.js');
    var database = require(test_utils.SRC_PATH + '/server/database.js');

    describe('test_views_generator', function() {

        before(function(done) {
            test_utils.initAndFillDatabase(done);
        });

        after(function(done) {
            test_utils.dropDatabase(done);
        });

        describe('RESULTS: _testteam', function() {
            it('should generate checkpoints html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/last-checkpoints-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('checkpoints', "_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });

            it('should generate results html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/individual-results-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('results', "_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });

            it('should generate index html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/index-expected.html', function (expected_html) {
                    viewsGenerator.generateIndexHtml("_testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });

        describe('RESULTS: _testalone', function(){
            it('should generate results html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/individual-results-expected-alone.html', function (expected_html) {
                    viewsGenerator.generateHtml('results', "_testalone", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
            it('should generate index html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/index-expected-alone.html', function (expected_html) {
                    viewsGenerator.generateIndexHtml("_testalone", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });

        describe('RESULTS: _testwrong', function(){
            it('generateIndexHtml should generate link to team creation html (error thrown)', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/team-not-found-expected.html', function (expected_html) {
                    viewsGenerator.generateIndexHtml("_testwrong", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });

        describe('TEAM: _testteam/edit', function() {
            it('should generate team edition html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/team-edit-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('teamEdit', "_testteam", function(content) {
                        // assert.equal(content, expected_html); //TODO
                        done();
                    });
                });
            });
        });

        describe('ROOT: /', function() {
            it('should generate list of teams html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/all-teams-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('root', null, function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });
    });

}());
