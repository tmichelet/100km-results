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

    exports.log = function(filepath, data, callback) {
        fs.appendFile(filepath, data + '\n', callback);
    };

    exports.TEMPLATES_DIR = 'src/client/templates';

    var defaultOptions = {
        port: 8080,
        databasePath: './100km.sqlite',
        logfilePath: './logs.txt'
    };
    exports.defaultOptions = defaultOptions;

}());
