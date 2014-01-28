/*global describe, it, beforeEach, afterEach */

(function() {
    "use strict";

    var assert = require("assert");
    var fs = require('fs');

    var test_utils = require('./test_utils.js');
    var TEST_DB = test_utils.TEST_DATABASE;
    var database = require(test_utils.SRC_PATH + '/server/database.js');

    describe('test_database', function() {

        describe('Lifecycle', function() {
            it('createDB should create database, initialize it and create tables', function(done) {
                database.createDB(TEST_DB, function() {
                    assert(database.DB !== undefined);
                    test_utils.checkFileExists(TEST_DB, true, function() {
                        database.DB.schema.hasTable('teams').exec(function(err, result) {
                            assert(result === true);
                            done();
                        });
                    });
                });
            });

            it('dropDB should delete the database file, and remove the DB configuration', function(done) {
                test_utils.checkFileExists(TEST_DB, true, function() {
                    database.dropDB(TEST_DB, function() {
                        assert.equal(database.DB, undefined);
                        test_utils.checkFileExists(TEST_DB, false, function() {
                            done();
                        });
                    });
                });
            });
        });

        describe('Operations', function(){

            beforeEach(function(done) {
                database.createDB(TEST_DB, function() {done();});
            });
            afterEach(function(done) {
                database.dropDB(TEST_DB, function() {done();});
            });

            it('getTeam should retrieve nothing if database is empty', function(done) {
                database.getTeam("_testteam", function(data) {
                    test_utils.assertJsonEqual(data, {});
                    done();
                });
            });

            it('saveTeam should save correctly', function(done) {
                database.saveTeam("_testteam", "[4,100]", "[name one, name two]", function() {
                    database.getTeam("_testteam", function(data) {
                        test_utils.assertJsonEqual(data,
                            { teamname: '_testteam', bibs: '[4,100]', names: "[name one, name two]" });
                        done();
                    });
                });
            });

            it('saveTeam should update correctly', function(done) {
                database.saveTeam("_testteam", "[4,100]", "[name one, name two]", function() {
                    database.saveTeam("_testteam", "[40]", "[name one]", function() {
                        database.getTeam("_testteam", function(data) {
                            test_utils.assertJsonEqual(data,
                                { teamname: '_testteam', bibs: '[40]', names: "[name one]" });
                            done();
                        });
                    });
                });
            });
        });
        describe('Concurency', function() {
            it('requiring database twice should not change anything', function(done) {
                database.createDB(TEST_DB, function() {
                    database.saveTeam("_testteam", "[4,100]", "[name one, name two]", function() {
                        database.getTeam("_testteam", function(data1) {
                            var database2 = require(test_utils.SRC_PATH + '/server/database.js');
                            database2.getTeam("_testteam", function(data2) {
                                test_utils.assertJsonEqual(data1, data2);
                                database.dropDB(TEST_DB, function() {
                                    done();
                                });
                            });
                        });
                    });
                });
            });
            it('initializing a database should set the connection parameters without droping the data', function(done) {
                database.initDB("./test/server/100km-test-init.sqlite", function() {
                    database.getTeam("_testteam", function(data) {
                        test_utils.assertJsonEqual(data,
                            { teamname: '_testteam', bibs: '[4,100]', names: '[name one, name two]' });
                        // use former database
                        database.initDB(TEST_DB, function() {
                            done();
                        });
                    });
                });
            });
            it('initDB should use the default DB', function(done) {
                database.initDB(undefined, function() {
                    test_utils.assertJsonEqual({ filename: './100km-tests.sqlite' }, database.DB.client.connectionSettings);
                    done();
                });
            });
        });
    });
}());
