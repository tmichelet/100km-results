/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var SRC_PATH = '../../src';
    var TEST_DATABASE = './100km-tests.sqlite';

    var assert = require("assert");
    var fs = require('fs');

    var database = require(SRC_PATH + '/server/database.js');
    var test_utils = require('./test_utils.js');


    beforeEach(function(done) {
        database.createDB(TEST_DATABASE, function() {done();});
    });

    afterEach(function(done) {
        database.dropDB(TEST_DATABASE, function() {done();});
    });

    describe('Database', function(){
        describe('Lifecycle', function(){
            it('test database should be created and initialized', function(done) {
                test_utils.checkFileExists(TEST_DATABASE, true, function() {
                    database.dropDB(TEST_DATABASE, function() {
                        assert.equal(database.DB, undefined);
                        test_utils.checkFileExists(TEST_DATABASE, false, function() {
                            database.createDB(TEST_DATABASE, function() {
                                assert(database.DB !== undefined);
                                test_utils.checkFileExists(TEST_DATABASE, true, function() {
                                    done();
                                });
                            });
                        });
                    });
                });
            });
            it('insert, retrieve and update', function(done) {
                database.saveTeam("_testteam", "[4,100]", function() {
                    database.getTeam("_testteam", function(data) {
                        test_utils.assertJsonEqual(data, { name: '_testteam', bibs: '[4,100]' });
                        database.saveTeam("_testteam", "[40,100]", function() {
                            database.getTeam("_testteam", function(data) {
                                assert.equal("[40,100]", data.bibs);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
}());