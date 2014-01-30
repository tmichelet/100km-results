/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var assert = require("assert");
    var fs = require('fs');

    var SRC_PATH = '../../src';
    var utils = require(SRC_PATH + '/server/utils.js');
    var database = require(SRC_PATH + '/server/database.js');

    describe('Utils', function(){
        it('getContentOf should return the content of a file', function(done) {
            utils.getContentOf('test/server/_file.txt', function(content) {
                assert.equal("hello file", content);
                done();
            });
        });

        describe('test_Utils', function(){
            it('checkFileExists should raise if existence of file is wrong', function(done) {
                checkFileExists('./test/server/_wrongfile.txt', false, function() {
                    checkFileExists('./test/server/_file.txt', true, function() {
                        done();
                    });
                });
            });
        });
    });

    /*
        Utils exports
    */

    var checkFileExists = function(path, expected, callback) {
        fs.exists(path, function(exists) {
            if ((exists && expected) || (!exists && !expected)) {
                callback();
            }
            else {
                assert.ok(false, 'file ' + path + '; exists:' + exists + '; expected to exist:' + expected);
            }
        });
    };
    exports.checkFileExists = checkFileExists;
    
    exports.assertJsonEqual = function (j1, j2) {
        return assert.equal(JSON.stringify(j1), JSON.stringify(j2));
    };

    
    exports.SRC_PATH = SRC_PATH;
    var TEMPLATES_PATH = 'test/client/templates';
    exports.TEMPLATES_PATH = TEMPLATES_PATH;

    var testOptions = {
        port: 8080,
        databasePath: './100km-tests.sqlite',
        logfilePath: 'test/server/_logs.txt'
    };
    exports.testOptions = testOptions;

    exports.initAndFillDatabase = function(done) {
        database.createDB(testOptions.databasePath, function() {
            database.saveTeam('_testteam', '[4,100]', '[Emeline Landemaine,Emeline Parizel]', function() {
                database.saveTeam('_testalone', '[4]', '[Emeline Landemaine]', function() {
                    done();
                });
            });
        });
    };

    exports.dropDatabase = function(done) {
        database.dropDB(testOptions.databasePath, function() {done();});
    };

    exports.assertEndsWith = function(string, suffix) {
        var result = string.indexOf(suffix, string.length - suffix.length) !== -1;
        assert(result, suffix + ' vs ' + string);
    };

}());
