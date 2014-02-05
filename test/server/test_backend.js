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
                    assert.deepEqual(data,
                        {"teamname":"testteam","persons":[{"bib":40,"name":"Emeline Landemaine"},
                        {"bib":100,"name":"Emeline Parizel"}]});
                    done();
                });
            });
            it('should retrieve one person for testalone', function(done) {
                backend.retrieveTeam("testalone", function(data) {
                    assert.deepEqual(data,
                        {"teamname":"testalone","persons":[{"bib":40,"name":"Emeline Landemaine"}]});
                    done();
                });
            });
            it('should retrieve 0 person for testwrong', function(done) {
                backend.retrieveTeam("testwrong", function(data) {
                    assert.deepEqual(data, {"teamname":"testwrong","persons":[]});
                    done();
                });
            });
        });

        describe('retrieveCheckpoints', function(){
            it('should retrieve three checkpoints for bib 100', function(done) {
                backend.retrieveCheckpoints(100, function(data) {
                    assert.deepEqual(data.checkpoints, testteam.persons[1].checkpoints);
                    done();
                });
            });
            it('should retrieve two checkpoints for bib 4', function(done) {
                backend.retrieveCheckpoints(40, function(data) {
                    assert.deepEqual(data.checkpoints, testteam.persons[0].checkpoints);
                    done();
                });
            });
            it('should retrieve 0 checkpoints for bib 0', function(done) {
                backend.retrieveCheckpoints(0, function(data) {
                    assert.deepEqual(data.checkpoints, []);
                    done();
                });
            });
        });

        describe('retrieveTeamCheckpoints', function(){
            it('should retrieve two persons for testteam', function(done) {
                backend.retrieveTeamCheckpoints("testteam", function(data) {
                    assert.deepEqual(data, testteam);
                    done();
                });
            });
            it('should retrieve one person for testalone', function(done) {
                backend.retrieveTeamCheckpoints("testalone", function(data) {
                    assert.deepEqual(data, testalone);
                    done();
                });
            });
            it('should raise for testwrong', function(done) {
                backend.retrieveTeamCheckpoints("testwrong", function(data) {
                    assert.deepEqual(data, { teamname: 'testwrong', persons: [] });
                    done();
                });
            });
        });

        describe('retrieveAllTeams', function(){
            it('should retrieve two teams', function(done) {
                backend.retrieveAllTeams(null, function(data) {
                    assert.deepEqual(data, {"teams":[{"teamname":"testteam"},{"teamname":"testalone"}]});
                    done();
                });
            });
            it('should retrieve one person for testalone', function(done) {
                backend.retrieveTeamCheckpoints("testalone", function(data) {
                    assert.deepEqual(data, testalone);
                    done();
                });
            });
            it('should raise for testwrong', function(done) {
                backend.retrieveTeamCheckpoints("testwrong", function(data) {
                    assert.deepEqual(data, { teamname: 'testwrong', persons: [] });
                    done();
                });
            });
        });

        describe('retrievePerson', function(){
            it('should retrieve one person with a bib number', function(done) {
                backend.retrievePerson("40", function(data) {
                    assert.deepEqual(data, {"bib":40,"first_name":"Emeline","name":"LANDEMAINE"});
                    backend.retrievePerson(40, function(data) {
                        assert.deepEqual(data, {"bib":40,"first_name":"Emeline","name":"LANDEMAINE"});
                        done();
                    });
                });
            });
            it('should retrieve several persons with a first_name', function(done) {
                backend.retrievePerson("emel", function(data) {
                    assert.deepEqual(data, {"rows":[{"first_name":"Emeline","name":"PARIZEL","bib":100},{"first_name":"Emeline","name":"LANDEMAINE","bib":40}]});
                    done();
                });
            });
            it('should retrieve one person with a full name', function(done) {
                backend.retrievePerson("emeline land", function(data) {
                    assert.deepEqual(data, {"rows":[{"first_name":"Emeline","name":"LANDEMAINE","bib":40}]});
                    done();
                });
            });
            it('should raise an error if called with empty input', function(done) {
                try {
                    backend.retrievePerson("", function() {});
                }
                catch(err) {
                    done();
                }
            });
        });

        describe('callCouchDB', function(){
            it('should retrieve checkpoints for bib 100', function(done) {
                var url = "http://localhost:5984/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B100%2Cnull%5D&endkey=%5B100%2C4%5D&inclusive_end=false";
                backend.callCouchDB(url, function(data) {
                    mockedCallCouchDB(url, function(expectedData) {
                        assert.deepEqual(data, expectedData);
                        done();
                    });
                });
            });
            it('should retrieve checkpoints for bib 40', function(done) {
                var url = "http://localhost:5984/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B40%2Cnull%5D&endkey=%5B40%2C4%5D&inclusive_end=false";
                backend.callCouchDB(url, function(data) {
                    mockedCallCouchDB(url, function(expectedData) {
                        assert.deepEqual(data, expectedData);
                        done();
                    });
                });
            });
            it('should retrieve person for bib 40', function(done) {
                var url = "http://localhost:5984/steenwerck100km/contestant-40";
                backend.callCouchDB(url, function(data) {
                    mockedCallCouchDB(url, function(expectedData) {
                        assert.deepEqual(data, expectedData);
                        done();
                    });
                });
            });
            it('should retrieve 2 person for name Emeline', function(done) {
                var url = "http://localhost:5984/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22emel%22&endkey=%22emel%EF%BF%B0%22";
                backend.callCouchDB(url, function(data) {
                    mockedCallCouchDB(url, function(expectedData) {
                        assert.deepEqual(data, expectedData);
                        done();
                    });
                });
            });
            it('should retrieve one person name Emeline Land', function(done) {
                var url = "http://localhost:5984/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22emeline%22&endkey=%22emeline%EF%BF%B0%22&term=land";
                backend.callCouchDB(url, function(data) {
                    mockedCallCouchDB(url, function(expectedData) {
                        assert.deepEqual(data, expectedData);
                        done();
                    });
                });
            });
        });

        describe('fillCheckpoint', function(){
            it('should fill properly', function() {
                assert.deepEqual(backend.fillCheckpoint({"key":[100,1,1],"value":1390337566986}), testteam.persons[1].checkpoints[0]);
                assert.deepEqual(backend.fillCheckpoint({"key":[100,1,2],"value":1390337584343}), testteam.persons[1].checkpoints[1]);
                assert.deepEqual(backend.fillCheckpoint({"key":[100,2,1],"value":1390338757392}), testteam.persons[1].checkpoints[2]);
                assert.deepEqual(backend.fillCheckpoint({"key":[100,1,1],"value":1390337566986}), testteam.persons[0].checkpoints[0]);
                assert.deepEqual(backend.fillCheckpoint({"key":[100,1,2],"value":1390338257392}), testteam.persons[0].checkpoints[1]);
            });
        });
    });

    var mockedCallCouchDB = function(uri, callback) {
        var jsonResponse = {};
        switch (uri) {
            // checkpoints
            case "http://localhost:5984/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B100%2Cnull%5D&endkey=%5B100%2C4%5D&inclusive_end=false":
                jsonResponse = {"rows":[{"key":[100,1,1],"value":1390337566986},{"key":[100,1,2],"value":1390337584343},{"key":[100,2,1],"value":1390338757392}]};
                break;

            case "http://localhost:5984/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B40%2Cnull%5D&endkey=%5B40%2C4%5D&inclusive_end=false":
                jsonResponse = {"rows":[{"key":[40,1,1],"value":1390337566986},{"key":[40,1,2],"value":1390338257392}]};
                break;

            // bibs
            case "http://localhost:5984/steenwerck100km/contestant-40":
                jsonResponse = {"_id":"contestant-40","first_name":"Emeline","name":"LANDEMAINE","wrong":"wrong"};
                break;
            // names
            case "http://localhost:5984/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22emel%22&endkey=%22emel%EF%BF%B0%22":
                jsonResponse = {"rows":[{"value":{"first_name":"Emeline","name":"PARIZEL","bib":100}},{"value":{"first_name":"Emeline","name":"LANDEMAINE","bib":40}}]};
                break;

            case "http://localhost:5984/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22emeline%22&endkey=%22emeline%EF%BF%B0%22&term=land":
                jsonResponse = {"rows":[{"value":{"first_name":"Emeline","name":"LANDEMAINE","bib":40, "wrong":"wrong"}}]};
                break;
        }
        callback(jsonResponse);
    };

    var testteam = {
        "teamname": "testteam",
        "persons": [
            {
                "bib": 40,
                "name": "Emeline Landemaine",
                "checkpoints": [
                    {
                    "time": "21:52:46",
                    "distance": 12.25,
                    "name": "Le froid nid",
                    "lap": 1
                    },
                    {
                    "time": "22:04:17",
                    "distance": 17.28,
                    "name": "La Croix du Bac",
                    "lap": 1
                    }
                ]
            },
            {
                "bib": 100,
                "name": "Emeline Parizel",
                "checkpoints": [
                    {
                    "time": "21:52:46",
                    "distance": 12.25,
                    "name": "Le froid nid",
                    "lap": 1
                    },
                    {
                    "time": "21:53:04",
                    "distance": 17.28,
                    "name": "La Croix du Bac",
                    "lap": 1
                    },
                    {
                    "time": "22:12:37",
                    "distance": 43.69,
                    "name": "Le froid nid",
                    "lap": 2
                    }
                ]
            }
        ]
    };


    var testalone = {
        "teamname": "testalone",
        "persons": [
            {
                "bib": 40,
                "name": "Emeline Landemaine",
                "checkpoints": [
                    {
                    "time": "21:52:46",
                    "distance": 12.25,
                    "name": "Le froid nid",
                    "lap": 1
                    },
                    {
                    "time": "22:04:17",
                    "distance": 17.28,
                    "name": "La Croix du Bac",
                    "lap": 1
                    }
                ]
            }
        ]
    };

}());
