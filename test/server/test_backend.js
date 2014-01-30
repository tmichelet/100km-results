/*global describe, it, before, after */

(function() {
    "use strict";

    var assert = require("assert");

    var test_utils = require('./test_utils.js');
    var backend = require(test_utils.SRC_PATH + '/server/backend.js');
    var mockedData = require('./_mocked-data.js');

    describe('test_backend', function() {

        before(function(done) {
            test_utils.initAndFillDatabase(done);
        });

        after(function(done) {
            test_utils.dropDatabase(done);
        });

        describe('retrieveTeam', function(){
            it('should retrieve two persons for testteam', function(done) {
                backend.retrieveTeam("testteam", function(data) {
                    test_utils.assertJsonEqual(data,
                        {"teamname":"testteam","persons":[{"bib":4,"name":"Emeline Landemaine"},
                        {"bib":100,"name":"Emeline Parizel"}]});
                    done();
                });
            });
            it('should retrieve one person for testalone', function(done) {
                backend.retrieveTeam("testalone", function(data) {
                    test_utils.assertJsonEqual(data,
                        {"teamname":"testalone","persons":[{"bib":4,"name":"Emeline Landemaine"}]});
                    done();
                });
            });
            it('should retrieve 0 person for testwrong', function(done) {
                backend.retrieveTeam("testwrong", function(data) {
                    test_utils.assertJsonEqual(data, {"teamname":"testwrong","persons":[]});
                    done();
                });
            });
        });

        describe('retrieveCheckpoints', function(){
            it('should retrieve three checkpoints for bib 100', function(done) {
                backend.retrieveCheckpoints(100, function(data) {
                    test_utils.assertJsonEqual(data.checkpoints, testteam.persons[1].checkpoints);
                    done();
                });
            });
            it('should retrieve two checkpoints for bib 4', function(done) {
                backend.retrieveCheckpoints(4, function(data) {
                    test_utils.assertJsonEqual(data.checkpoints, testteam.persons[0].checkpoints);
                    done();
                });
            });
            it('should retrieve 0 checkpoints for bib 0', function(done) {
                backend.retrieveCheckpoints(0, function(data) {
                    test_utils.assertJsonEqual(data.checkpoints, []);
                    done();
                });
            });
        });

        describe('retrieveTeamCheckpoints', function(){
            it('should retrieve two persons for testteam', function(done) {
                backend.retrieveTeamCheckpoints("testteam", function(data) {
                    test_utils.assertJsonEqual(data, testteam);
                    done();
                });
            });
            it('should retrieve one person for testalone', function(done) {
                backend.retrieveTeamCheckpoints("testalone", function(data) {
                    test_utils.assertJsonEqual(data, testalone);
                    done();
                });
            });
            it('should raise for testwrong', function(done) {
                backend.retrieveTeamCheckpoints("testwrong", function(data) {
                    test_utils.assertJsonEqual(data, { teamname: 'testwrong', persons: [] });
                    done();
                });
            });
        });

        describe('retrieveAllTeams', function(){
            it('should retrieve two teams', function(done) {
                backend.retrieveAllTeams(null, function(data) {
                    test_utils.assertJsonEqual(data, {"teams":[{"teamname":"testteam"},{"teamname":"testalone"}]});
                    done();
                });
            });
            it('should retrieve one person for testalone', function(done) {
                backend.retrieveTeamCheckpoints("testalone", function(data) {
                    test_utils.assertJsonEqual(data, testalone);
                    done();
                });
            });
            it('should raise for testwrong', function(done) {
                backend.retrieveTeamCheckpoints("testwrong", function(data) {
                    test_utils.assertJsonEqual(data, { teamname: 'testwrong', persons: [] });
                    done();
                });
            });
        });
    });

    var testteam = {
        "teamname": "testteam",
        "persons": [
            {
                "bib": 4,
                "name": "Emeline Landemaine",
                "checkpoints": [
                    {
                    "time": "21:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 1
                    },
                    {
                    "time": "04:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 2
                    }
                ]
            },
            {
                "bib": 100,
                "name": "Emeline Parizel",
                "checkpoints": [
                    {
                    "time": "21:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 1
                    },
                    {
                    "time": "04:17:32",
                    "distance": "55.00",
                    "name": "La croix du Bac",
                    "lap": 2
                    },
                    {
                    "time": "14:17:32",
                    "distance": "75.00",
                    "name": "La croix du Bac",
                    "lap": 3
                    }
                ]
            }
        ]
    };

    var testalone = {
        "teamname": "testalone",
        "persons": [
            {
                "bib": 4,
                "name": "Emeline Landemaine",
                "checkpoints": [
                    {
                    "time": "21:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 1
                    },
                    {
                    "time": "04:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 2
                    }
                ]
            }
        ]
    };

}());
