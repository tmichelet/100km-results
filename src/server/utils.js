(function() {
    "use strict";

    var fs = require('fs');
    var local_utils = require('./local_utils');

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
        port: 15000,
        host: 'localhost',
        databasePath: './100km.sqlite',
        logfilePath: './logs.txt',
        '100kmUrl': local_utils.localOptions['100kmUrl']
    };
    exports.defaultOptions = defaultOptions;

}());
