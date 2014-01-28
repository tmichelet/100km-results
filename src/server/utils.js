(function() {
    "use strict";

    var fs = require('fs');

    exports.getContentOf = function (filepath, callback) {
        fs.readFile(filepath, function (err, buffer) {
            if (err) {
                throw err;
            }
            callback(buffer.toString());
        });
    };

    exports.TEMPLATES_DIR = 'src/client/templates';

}());
