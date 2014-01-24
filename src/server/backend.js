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

    exports.generateCheckpointsHtml = function(callback) {
        generateTemplatedHtml('src/client/last-checkpoint-template.html', callback);
    };

    exports.generateResultsHtml = function(callback) {
        generateTemplatedHtml('src/client/individual-results-template.html', callback);
    };

    function generateTemplatedHtml(templatePath, callback) {
        utils.getContentOf(templatePath, function (source) {
            var template = Handlebars.compile(source);
            var data = retrieveData();
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
