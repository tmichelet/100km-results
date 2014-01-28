/*global console */

(function() {
    "use strict";

    var utils = require('./utils.js');
    var data = require('../../test/server/_mocked-data.js'); //TODO mocked data here
    var database = require('./database.js');
    
    var retrieveTeamCheckpoints = function(teamname, callback) {
        retrieveTeam(teamname, function(team) {
            var teamSize = team.persons.length;
            if(teamSize === 0) {
                throw "Team not created yet";
            }
            for(var i=0; i<teamSize; i++) {
                team.persons[i].checkpoints = data.getPerson(team.persons[i].bib);
            }
            callback(team);
        });
    };
    exports.retrieveTeamCheckpoints = retrieveTeamCheckpoints;

    var retrieveTeam = function(teamname, callback) {
        callback(data.getTeam(teamname));
    };
    exports.retrieveTeam = retrieveTeam;

}());
