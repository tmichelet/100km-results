/*global describe, it, beforeEach, afterEach */

(function () {
    "use strict";

    var assert = require("assert");
    var fs = require('fs');
    var utils = require('../../src/server/utils.js');

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

}());