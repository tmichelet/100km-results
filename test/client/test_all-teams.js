/*global describe, it, beforeEach, afterEach, window */

(function() {
    "use strict";

    var assert = require("assert");
    var test_utils = require('../server/test_utils.js');

    var html = '<html><body><div id="content"></div></body></html>';
    global.window = require("jsdom").jsdom(html).createWindow();
    global.document = window.document;
    var allTeams = require(test_utils.SRC_PATH + '/client/all-teams.js');

    var $ = require('jquery-browserify');

    describe('test_all-teams', function() {

        afterEach(function() {
            $("#content").html("");
        });

        it('extractNewTeamName should retrieve the appropriate value', function(done) {
            $("#content").html("<li id='new-team'><input value='the target'><a id='me' href='#'>créer</a></li>");
            assert.equal(allTeams.extractNewTeamName('#new-team'), 'the target');
            done();
        });

        it('initNewTeam should add onClickListener to the a element, which triggers a redirection', function(done) {
            $("#content").html("<li id='new-team'><input value='theTarget'><a id='me' href='#'>créer</a></li>");
            allTeams.initNewTeam('#new-team');
            $('#me').click();
            //TODO can't test the window.location.href properly
            done();
        });
    });

}());
