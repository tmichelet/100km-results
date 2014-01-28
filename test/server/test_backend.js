/*global describe, it, before, after */

(function () {
    "use strict";

    var SRC_PATH = '../../src';
    var TEST_DATABASE = './100km-backend-tests.sqlite';

    var assert = require("assert");

    var backend = require(SRC_PATH + '/server/backend.js');
    var mockedData = require('./_mocked-data.js');
    var test_utils = require('./test_utils.js');
    var database = require(SRC_PATH + '/server/database.js');

    describe('Backend', function() {

        before(function(done) {
            database.createDB(TEST_DATABASE, function() {
                database.saveTeam('_testteam', '[4,40]', '[name one, name two]', function() {
                    database.saveTeam('_testalone', '[4]', '[name one]', function() {
                        done();
                    });
                });
            });
        });

        after(function(done) {
            database.dropDB(TEST_DATABASE, function() {done();});
        });

        describe('retrieveTeam', function(){
            it('should retrieve two persons for _testteam', function(done) {
                backend.oldretrieveTeam("_testteam", function(data) {
                    test_utils.assertJsonEqual(mockedData.getTeam("_testteam"), data);
                    done();
                });
            });
            it('should retrieve one person for _testalone', function(done) {
                backend.oldretrieveTeam("_testalone", function(data) {
                    test_utils.assertJsonEqual(mockedData.getTeam("_testalone"), data);
                    done();
                });
            });
            it('should retrieve 0 person for _testwrong', function(done) {
                backend.oldretrieveTeam("_testwrong", function(data) {
                    test_utils.assertJsonEqual(mockedData.getTeam("_testwrong"), data);
                    done();
                });
            });
        });

        describe('retrieveTeamCheckpoints', function(){
            it('should retrieve two persons for _testteam', function(done) {
                backend.retrieveTeamCheckpoints("_testteam", function(data) {
                    test_utils.assertJsonEqual(mockedData.getAllPersons(), data);
                    done();
                });
            });
            it('should retrieve one person for _testalone', function(done) {
                backend.retrieveTeamCheckpoints("_testalone", function(data) {
                    test_utils.assertJsonEqual(mockedData.getEmelineL(), data);
                    done();
                });
            });
            it('should raise for _testwrong', function(done) {
                try{
                    backend.retrieveTeamCheckpoints("_testwrong", function() {});
                }
                catch(err) {
                    done();
                }
            });
        });
    });

}());
