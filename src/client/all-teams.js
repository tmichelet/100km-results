/*global console */

(function() {
    "use strict";

    var $ = require('jquery-browserify');

    exports.initNewTeam = function(element) {
        $(element).find('a').click(function(event) {
            window.location.replace(extractNewTeamName(element) + '/edit');
        });
    };

    var extractNewTeamName = function(element) {
        return $(element).find('input').attr('value');
    };
    exports.extractNewTeamName = extractNewTeamName;

}());
