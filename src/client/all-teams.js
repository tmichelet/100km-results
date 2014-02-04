/*global console */

(function() {
    "use strict";

    var $ = require('jquery-browserify');

    exports.initNewTeam = function(element) {
        var submit = function(event) {
            try {
                var teamname = extractNewTeamName(element);
                window.location.replace(extractNewTeamName(element) + '/edit');
            }
            catch(err) {
                $('#error').text(err);
            }
        };
        $(element).find('a').click(submit);
        // $(element).find('input').submit(submit); //TODO on enter or on mobile next
    };

    var extractNewTeamName = function(element) {
        var value = $(element).find('input').attr('value');
        if(value.length === 0) {
            throw "Veuillez saisir un nom d'équipe";
        }
        if(value[0] === '_' || value.indexOf(';') !== -1) {
            throw "Veuillez saisir un nom d'équipe ne contenant pas de _ ou de ;";
        }
        if($.inArray(value, extractExistingTeamName(element)) !== -1) {
            throw "L'équipe existe déjà";
        }
        return value;
    };
    exports.extractNewTeamName = extractNewTeamName;

    var extractExistingTeamName = function(element) {
        var existingTeams = [];
        $(element).parent().find('a').each(function(i, elt) {
            existingTeams.push($(elt).text());
        });
        return existingTeams;
    };
    exports.extractExistingTeamName = extractExistingTeamName;

}());
