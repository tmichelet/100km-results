/*global console */

(function() {
    "use strict";

    var Handlebars = require('Handlebars');
    initHandlebars();

    var utils = require('./utils.js');
    
    function retrieveData() {
        var mockedData = require('../../test/server/_mocked-data.js');
        return mockedData.getAllPersons();
    }

    var generateCheckpointsHtml = function(callback) {
        generateTemplatedHtml('src/client/last-checkpoint-template.html', retrieveData(), callback);
    };
    exports.generateCheckpointsHtml = function(callback) {
        generateCheckpointsHtml(callback);
    };

    var generateResultsHtml = function(callback) {
        generateTemplatedHtml('src/client/individual-results-template.html', retrieveData(), callback);
    };
    exports.generateResultsHtml = function(callback) {
        generateResultsHtml(callback);
    };

    exports.generateIndexHtml = function(callback) {
        generateResultsHtml(function(generatedResultsHtml) {
            generateCheckpointsHtml(function(generatedCheckpointsHtml) {
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
