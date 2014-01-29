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

}());
