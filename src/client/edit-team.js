/*global console */

(function() {
    "use strict";

    var $ = require('jquery-browserify');

    var removeLineOf = function(element) {
        $(element).closest('tr').remove();
    };
    exports.removeLineOf = removeLineOf;

    exports.initPersonsDeletion = function(element) {
        $(element).find('td.deleteLine').click(function(event) {
            removeLineOf(event.target);
        });
    };

    /* 
        This method is based on conventions.
        It expects a table containing lines like
        <tr>    <td>bib</td>  <td>name</td>   <td>x</td>  </tr>
    */
    var extractTeamData = function(element) {
        var bibs = "";
        var names = "";
        var separator = ',';
        $(element).find('tr').each(function(i, elt) {
            var data = extractPersonData(elt);
            bibs += data.bib + separator;
            names += data.name + separator;
        });
        bibs = '[' + bibs.slice(0, bibs.length-1) + ']';
        names = '[' + names.slice(0, names.length-1) + ']';
        return './edit/' + bibs + '/' + names;
    };
    exports.extractTeamData = extractTeamData;

    var extractPersonData = function(elt) {
        var extractLine = function(elt) {
            return elt.text().replace(/,|\[|\]|_/g, '');
        };
        return {
            'bib': extractLine($($(elt).children()[0])),
            'name': extractLine($($(elt).children()[1]))
        };
    };
    exports.extractPersonData = extractPersonData;

    exports.initSubmitNewTeam = function(element) {
        $(element).click(function(event) {
            $.get(extractTeamData("#bibs"), function() {
                window.location.replace('./');
            });
        });
    };

}());
