/*global console */

(function() {
    "use strict";

    var Handlebars = require('Handlebars');
    initHandlebars();

    var utils = require('./utils.js');
    var data = require('../../test/server/_mocked-data.js'); //TODO mocked data here
    
    var retrieveData = function(teamname) {
        var team = data.getTeam(teamname);
        var teamSize = team.persons.length;
        for(var i=0; i<teamSize; i++) {
            team.persons[i].checkpoints = data.getPerson(team.persons[i].bib);
        }
        return team;
    };
    exports.retrieveData = retrieveData;

    var generateCheckpointsHtml = function(teamname, callback) {
        generateTemplatedHtml('src/client/last-checkpoint-template.html', retrieveData(teamname), callback);
    };
    exports.generateCheckpointsHtml = generateCheckpointsHtml;

    var generateResultsHtml = function(teamname, callback) {
        generateTemplatedHtml('src/client/individual-results-template.html', retrieveData(teamname), callback);
    };
    exports.generateResultsHtml = generateResultsHtml;

    exports.generateIndexHtml = function(teamname, callback) {
        generateResultsHtml(teamname, function(generatedResultsHtml) {
            generateCheckpointsHtml(teamname, function(generatedCheckpointsHtml) {
                var indexData = {
                    'last-checkpoints': generatedCheckpointsHtml,
                    'individual-results': generatedResultsHtml
                };
                generateTemplatedHtml('src/client/index-template.html', indexData, callback);
            });
        });
    };

    function generateTemplatedHtml(templatePath, data, callback) {
        utils.getContentOf(templatePath, function (source) {
            var template = Handlebars.compile(source);
            var result = template(data);
            callback(result);
        });
    }

    function initHandlebars() {
        Handlebars.registerHelper("last", function(array, options) {
            return options.fn(array[array.length-1]);
        });
    }

}());
