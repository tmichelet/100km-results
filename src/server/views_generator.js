/*global console */

(function() {
    "use strict";

    var Handlebars = require('Handlebars');
    initHandlebars();

    var utils = require('./utils.js');
    var backend = require('./backend.js');

    var TEMPLATES_DIR = 'src/client/';
    var MAPPING = {
        'checkpoints': {
            'template': 'last-checkpoint-template.html',
            'data': backend.retrieveTeamCheckpoints
        },
        'results': {
            'template': 'individual-results-template.html',
            'data': backend.retrieveTeamCheckpoints
        },
        'teamNotFound': {
            'template': 'team-not-found-template.html',
            'data': function(teamname) {return {'teamname': teamname};}
        },
        'teamEdit': {
            'template': 'team-edit-template.html',
            'data': function(teamname) {return {'teamname': teamname, 'bibs': '[4,40]'};}
        }
    };

    exports.generateIndexHtml = function(teamname, callback) {
        try {
            generateHtml('results', teamname, function(generatedResultsHtml) {
                generateHtml('checkpoints', teamname, function(generatedCheckpointsHtml) {
                    var indexData = {
                        'last-checkpoints': generatedCheckpointsHtml,
                        'individual-results': generatedResultsHtml
                    };
                    generateTemplatedHtml('src/client/index-template.html', indexData, callback);
                });
            });
        }
        catch(err) {
            // team doesn't exist, render the team edition interface
            generateHtml('teamNotFound', teamname, function(generatedHtml) {
                callback(generatedHtml);
            });
        }
    };

    var generateHtml = function(templateName, teamname, callback) {
        generateTemplatedHtml(
            TEMPLATES_DIR + MAPPING[templateName].template,
            MAPPING[templateName].data(teamname),
            callback
        );
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
