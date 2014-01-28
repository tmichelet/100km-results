/*global describe, it, beforeEach, afterEach */

(function() {
    "use strict";

    var assert = require("assert");
    var test_utils = require('../server/test_utils.js');
    var editTeam = require(test_utils.SRC_PATH + '/client/edit-team.js');

    describe('test_edit-team', function() {
        it('helloworld should return 1', function(done) {
            assert.equal(editTeam.helloworld(), 1);
            done();
        });
    });


}());
