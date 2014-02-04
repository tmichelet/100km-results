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

        describe('RESULTS: testteam', function() {
            it('should generate checkpoints html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/last-checkpoints-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('checkpoints', "testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });

            it('should generate results html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/individual-results-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('results', "testteam", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });

            it('should generate index html', function(done) {
                viewsGenerator.generateIndexHtml("testteam", function(content) {
                    assert(content.indexOf('Emeline Landemaine') !== -1);
                    assert(content.indexOf('Emeline Parizel') !== -1);
                    assert(content.indexOf('<div id="individual-results">') !== -1);
                    assert(content.indexOf('<div id="last-checkpoints">') !== -1);
                    done();
                });
            });
        });

        describe('RESULTS: testalone', function(){
            it('should generate results html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/individual-results-expected-alone.html', function (expected_html) {
                    viewsGenerator.generateHtml('results', "testalone", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
            it('should generate index html', function(done) {
                viewsGenerator.generateIndexHtml("testalone", function(content) {
                    assert(content.indexOf('Emeline Landemaine') !== -1);
                    assert(content.indexOf('Emeline Parizel') === -1);
                    assert(content.indexOf('<div id="individual-results">') !== -1);
                    assert(content.indexOf('<div id="last-checkpoints">') !== -1);
                    done();
                });
            });
        });

        describe('RESULTS: testwrong', function(){
            it('generateIndexHtml should generate link to team creation html (error thrown)', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/team-not-found-expected.html', function (expected_html) {
                    viewsGenerator.generateIndexHtml("testwrong", function(content) {
                        assert.equal(content, expected_html);
                        done();
                    });
                });
            });
        });

        describe('TEAM: testteam/edit', function() {
            it('should generate team edition html', function(done) {
                utils.getContentOf(test_utils.TEMPLATES_PATH + '/team-edit-expected.html', function (expected_html) {
                    viewsGenerator.generateHtml('teamEdit', "testteam", function(content) {
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
                        // assert.equal(content, expected_html); //TODO
                        done();
                    });
                });
            });
        });
    });

}());
