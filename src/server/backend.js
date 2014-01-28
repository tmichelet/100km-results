/*global console */

(function() {
    "use strict";

    var utils = require('./utils.js');
    var data = require('../../test/server/_mocked-data.js'); //TODO mocked data here
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
            // it returns a JSON object
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
                    response.persons.push({'bib': parseInt(bibs[i]), 'name': names[i]});
                }
                callback(response);
            }
        });
    };
    exports.retrieveTeam = retrieveTeam;

    var retrieveCheckpoints = function(bib, callback) {
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

}());
