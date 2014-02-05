/*global console */

(function() {
    "use strict";

    var utils = require('./utils.js');
    var database = require('./database.js');

    var retrieveTeamCheckpoints = function(teamname, callback) {
        retrieveTeam(teamname, function(team) {
            var teamSize = team.persons.length;
            var updateTeam = function(i) {
                return function(data) {
                    team.persons[i].checkpoints = data.checkpoints;
                };
            };

            for(var i=0; i<teamSize; i++) {
                retrieveCheckpoints(team.persons[i].bib, updateTeam(i));
            }
            // here the callback might happen before updateTeam is done, but that's all right since
            // it returns a reference to a JSON object that can be updated asynchronously
            callback(team);
        });
    };
    exports.retrieveTeamCheckpoints = retrieveTeamCheckpoints;

    var retrieveTeam = function(teamname, callback) {
        /*
            The data retrieved is like 
            { teamname: '_testteam',
              bibs: '[4,100]',
              names: '[Emeline Landemaine,Emeline Parizel]'
            }
            The output should be like
            { teamname: '_testteam',
              persons: 
               [ { bib: 4, name: 'Emeline Landemaine' },
                 { bib: 100, name: 'Emeline Parizel' } ]
            }
        */
        database.getTeam(teamname, function(data) {
            var response = {'teamname': teamname, "persons": []};
            if(data.bibs === undefined || data.bibs === '[]') {
                callback(response);
            }
            else {
                var bibs = data.bibs.substring(1, data.bibs.length - 1).split(',');
                var names = data.names.substring(1, data.names.length - 1).split(',');
                for(var i=0; i<bibs.length; i++) {
                    response.persons.push({'bib': parseInt(bibs[i], 10), 'name': names[i]});
                }
                callback(response);
            }
        });
    };
    exports.retrieveTeam = retrieveTeam;

    exports.retrieveAllTeams = function(_, callback) {
        database.getTeamsNames(function(data) {
            callback(data);
        });
    };

    var retrieveCheckpoints = function(bib, callback) {
        /*
            calling "http://localhost:5984/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B100%2Cnull%5D&endkey=%5B100%2C4%5D&inclusive_end=false":
            returns {"rows":[{"key":[100,1,1],"value":1390337566986},{"key":[100,1,2],"value":1390338757392},{"key":[100,2,1],"value":1390337584343}]};
            -> return {
                "bib": 100,
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
            };
        */
        // var url = "http://localhost:5984/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B"+bib+"%2Cnull%5D&endkey=%5B"+bib+"%2C4%5D&inclusive_end=false";
        // exports.callCouchDB(url, function(data) {
        //     var jsonResponse = {bib: bib, "checkpoints": []};
        //     var max = data.rows.length;
        //     for(var i=0; i<max; i++) {
        //         var row = data.rows[i];
        //         jsonResponse.checkpoints.push(fillCheckpoint(row));
        //     }
        //     callback(jsonResponse);
        // });
        var data = {"checkpoints": []};
        if(bib === 4) {
            data = {
                "bib": 4,
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
            };
        }
        if(bib === 100) {
            data = {
                "bib": 100,
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
            };
        }
        callback(data);
    };
    exports.retrieveCheckpoints = retrieveCheckpoints;

    var CHECKPOINTS = {
        1: {name: "Le froid nid", kms: 12.25},
        2: {name: "La Croix du Bac", kms: 17.28},
        3: {name: "La salle des sports, boucle 1", kms: 21.41},
        4: {name: "La menegatte", kms: 25.57},
        5: {name: "La gare", kms: 28.18},
        6: {name: "La blanche", kms: 33.04},
        7: {name: "La salle des sports, boucle 2", kms: 37.12}
    };
    var LAP_DISTANCE = 31.44;

    var fillCheckpoint = function(row) {
        /*
            row : {"key":[100,2,1],"value":1390337584343}
            means bib 100, lap 2, checkpoint 1, "time": "21:52:46"
        */
        var checkpoint = {};

        var date = new Date(row.value);
        checkpoint.time = date.toTimeString().substring(0,8);

        checkpoint.lap = row.key[1];
        checkpoint.name = CHECKPOINTS[row.key[2]].name;
        checkpoint.distance = CHECKPOINTS[row.key[2]].kms + (checkpoint.lap - 1) * LAP_DISTANCE;

        return checkpoint;
    };
    exports.fillCheckpoint = fillCheckpoint;

    exports.retrievePerson = function(input, callback) {
        /*
            if the input is a number
                http://localhost:5984/steenwerck100km/contestant-4
                {"_id":"contestant-4","first_name":"Hubert","name":"LECLERCQ",...}

            if the input is a string without spaces
                http://localhost:5984/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22emel%22&endkey=%22emel%EF%BF%B0%22
                {"rows":[{"value":{"first_name":"Emeline","name":"PARIZEL","bib":100}},{"value":{"first_name":"Emeline","name":"LANDEMAINE","bib":40}}]}

            if the input is a string containing spaces
                http://localhost:5984/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22emeline%22&endkey=%22emeline%EF%BF%B0%22&term=land
                same output
        */
        if(input.length === 0) {
            throw "Shouldn't be called without input";
        }
        var inputAsInt = parseInt(input, 10);

        if(isNaN(inputAsInt)) { // names
            var first_name = input.split(" ")[0] || "";
            var last_name = input.split(" ")[1] || "";
            var nameUrl = "http://localhost:5984/steenwerck100km/_design/search/_list/intersect-search/contestants-search?my_limit=10&startkey=%22"+first_name+"%22&endkey=%22"+first_name+"%EF%BF%B0%22";
            if(last_name.length > 0) {
                nameUrl = nameUrl + "&term=" + last_name;
            }
            exports.callCouchDB(nameUrl, function(data) {
                var jsonResponse = {rows: []};
                var max = data.rows.length;
                for(var i=0; i<max; i++) {
                    var row = {};
                    row.bib = data.rows[i].value.bib;
                    row.first_name = data.rows[i].value.first_name;
                    row.name = data.rows[i].value.name;
                    jsonResponse.rows.push(row);
                }
                callback(jsonResponse);
            });

        }
        else { // bibs
            var bibUrl = "http://localhost:5984/steenwerck100km/contestant-" + inputAsInt;
            exports.callCouchDB(bibUrl, function(data) {
                var jsonResponse = {};
                jsonResponse.bib = data._id.replace("contestant-", "");
                jsonResponse.first_name = data.first_name;
                jsonResponse.name = data.name;
                callback(jsonResponse);
            });
        }
    };

    exports.callCouchDB = function(uri, callback) { //TODO mocked here
        var jsonResponse = {};
        switch (uri) {
            // checkpoints
            case "http://localhost:5984/steenwerck100km/_design/search/_view/all-times-per-bib?startkey=%5B100%2Cnull%5D&endkey=%5B100%2C4%5D&inclusive_end=false":
                jsonResponse = {"rows":[{"key":[100,1,1],"value":1390337566986},{"key":[100,1,2],"value":1390338757392},{"key":[100,2,1],"value":1390337584343}]};
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

}());
