/*global console */

(function() {
    "use strict";

    var $ = require('jquery-browserify');
    var backend = require('../server/backend');

/*

    person deletion

*/

    var removeLineOf = function(element) {
        $(element).closest('tr').remove();
    };
    exports.removeLineOf = removeLineOf;

    exports.addOnPersonRemoveClick = function(element) {
        $(element).find('td.deleteLine').click(function(event) {
            removeLineOf(event.target);
        });
    };

/*

    person addition

*/
    //TODO tests
    exports.initSubmitBehaviour = function(submit) {
        $(submit).keydown(function (e) {
            setTimeout(exports.autocomplete, 100, submit);
        });
    };

    exports.autocomplete = function(submit) {
        backend.retrievePerson($(submit).attr("value"), function(data) {
            $("#datalist").html(generateOptionsHtml(extractAutocompleteTexts(data)));
            $("#datalist").children().click(addPerson);
        });
    };

    var addPerson = function(event) {
        try {
            $("#bibs").children().append(generateNewPersonHtml($(event.target).text()));
            exports.addOnPersonRemoveClick("table#bibs");
            $("#datalist").html("");
            $("input").attr("value", "");
        }
        catch(err) {}
    };
    exports.addPerson = addPerson;
    //end TODO tests

    var extractAutocompleteTexts = function(data) {
        var max = (data.rows || []).length;
        var texts = [];
        for(var i=0; i<max; i++) {
            texts.push(data.rows[i].first_name + " " + data.rows[i].name + " -- " + data.rows[i].bib);
        }
        return texts;
    };
    exports.extractAutocompleteTexts = extractAutocompleteTexts;

    var generateOptionsHtml = function(options) {
        var max = options.length;
        var html = "";
        for (var i=0; i<options.length; i++) {
            html += "<div class='option'>" + options[i] + "</div>";
        }
        return html;
    };
    exports.generateOptionsHtml = generateOptionsHtml;

    var generateNewPersonHtml = function(data) {
        var bib = data.split(' -- ')[1];
        var name = data.split(' -- ')[0].split(' ')[1];
        var first_name = data.split(' -- ')[0].split(' ')[0];
        return '<tr><td>'+bib+'</td><td>'+first_name+' '+name+'</td><td class="deleteLine">&times;</td></tr>';
    };
    exports.generateNewPersonHtml = generateNewPersonHtml;

/*

    submition

*/

    var extractTeamData = function(element) {
    /* 
        This method is based on conventions.
        It expects a table containing lines like
        <tr>    <td>bib</td>  <td>name</td>   <td>x</td>  </tr>
    */
        var bibs = [];
        var names = [];
        var separator = ',';
        $(element).find('tr').each(function(i, elt) {
            var data = extractPersonData(elt);
            bibs.push(data.bib);
            names.push(data.name);
        });
        bibs = '[' + bibs.join(separator) + ']';
        names = '[' + names.join(separator) + ']';
        return ['./edit', bibs, names].join('/');
    };
    exports.extractTeamData = extractTeamData;
    
    var escapeText = function(elt) {
        return elt.text().replace(/,|\[|\]|_/g, '');
    };

    var extractPersonData = function(elt) {
        return {
            'bib': escapeText($($(elt).children()[0])),
            'name': escapeText($($(elt).children()[1]))
        };
    };
    exports.extractPersonData = extractPersonData;

    exports.initSubmitNewTeam = function(element) {
        /*
            On click, retrieve url to get, call it, and redirect to the results page
        */
        $(element).click(function(event) {
            $.get(extractTeamData("#bibs"), function() {
                window.location.replace('./');
            });
        });
    };

}());
