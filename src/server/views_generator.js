/*global console */

(function() {
    "use strict";

    var Handlebars = require('handlebars');
    initHandlebars();

    var utils = require('./utils.js');
    var backend = require('./backend.js');

    var MAPPING = {
        'checkpoints': {
            'template': '/last-checkpoint-template.html',
            'data': backend.retrieveTeamCheckpoints
        },
        'results': {
            'template': '/individual-results-template.html',
            'data': backend.retrieveTeamCheckpoints
        },
        'teamNotFound': {
            'template': '/team-not-found-template.html',
            'data': function(teamname, callback) {callback({'teamname': teamname});}
        },
        'teamEdit': {
            'template': '/team-edit-template.html',
            'data': backend.retrieveTeam
        },
        'root': {
            'template': '/all-teams-template.html',
            'data': backend.retrieveAllTeams
        }
    };

    exports.generateIndexHtml = function(teamname, callback) {
        backend.retrieveTeam(teamname, function(team) {
            if(team.persons.length !== 0) {
                generateHtml('results', teamname, function(generatedResultsHtml) {
                    generateHtml('checkpoints', teamname, function(generatedCheckpointsHtml) {
                        var indexData = {
                            'last-checkpoints': generatedCheckpointsHtml,
                            'individual-results': generatedResultsHtml,
                            'teamname': teamname
                        };
                        generateTemplatedHtml(utils.TEMPLATES_DIR  + '/index-template.html', indexData, callback);
                    });
                });
            }
            else {
            // team doesn't exist, render the team edition interface
                generateHtml('teamNotFound', teamname, function(generatedHtml) {
                    callback(generatedHtml);
                });
            }
        });
    };

    var generateHtml = function(templateName, teamname, callback) {
        MAPPING[templateName].data(teamname, function(data) {
            generateTemplatedHtml(
                utils.TEMPLATES_DIR + MAPPING[templateName].template,
                data,
                callback
            );
        });
    };
    exports.generateHtml = generateHtml;

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
