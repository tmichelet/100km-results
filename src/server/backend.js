/*global console */

(function() {
    "use strict";

    var utils = require('./utils.js');
    var data = require('../../test/server/_mocked-data.js'); //TODO mocked data here
    
    var retrieveData = function(teamname) {
        var team = data.getTeam(teamname);
        var teamSize = team.persons.length;
        if(teamSize === 0) {
            throw "Team not created yet";
        }
        for(var i=0; i<teamSize; i++) {
            team.persons[i].checkpoints = data.getPerson(team.persons[i].bib);
        }
        return team;
    };
    exports.retrieveData = retrieveData;

}());
