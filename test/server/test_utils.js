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
    });

}());