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
        it('extractNewTeamName should raise if non appropriate caracters', function(done) {
            $("#content").html("<li id='new-team'><input value='_wrong'><a id='me' href='#'>créer</a></li>");
            try {
                allTeams.extractNewTeamName('#new-team');
            }
            catch(err) {
                assert(err.indexOf("_") !== -1);
                $("#content").html("<li id='new-team'><input value=''><a id='me' href='#'>créer</a></li>");
                try {
                    allTeams.extractNewTeamName('#new-team');
                }
                catch(err) {
                    assert(err.indexOf("nom d'équipe") !== -1);
                    $("#content").html("<li id='new-team'><input value='team;name'><a id='me' href='#'>créer</a></li>");
                    try {
                        allTeams.extractNewTeamName('#new-team');
                    }
                    catch(err) {
                        done();
                    }
                }
            }
        });
        it('extractNewTeamName should raise if team already exists', function(done) {
            $("#content").html(
                "<li id='new-team'><input value='existingTeam'><a id='me' href='#'>créer</a></li>\
                <li><a href='existingTeam'>existingTeam</a></li>\
            ");
            try {
                allTeams.extractNewTeamName('#new-team');
            }
            catch(err) {
                assert(err.indexOf("existe") !== -1);
                done();
            }
        });

        it('extractExistingTeamName should retrieve the appropriate value', function(done) {
            $("#content").html(
                "<li id='new-team'><input value=''><a id='me' href='#'>créer</a></li>\
                <li><a href='existingTeam'>existingTeam</a></li>\
            ");
            assert.deepEqual(allTeams.extractExistingTeamName('#new-team'), ["créer","existingTeam"]);
            done();
        });

        it('initNewTeam should add onClickListener to the a element, which triggers a redirection', function(done) {
            $("#content").html(
                "<li id='new-team'><input value='existingTeam'><a id='me' href='#'>créer</a><span id='error'></span></li>\
                <li><a href='existingTeam'>existingTeam</a></li>\
            ");
            allTeams.initNewTeam('#new-team');
            $('#me').click();
            assert.equal("L'équipe existe déjà", $('#error').text());
            done();
        });
        it('initNewTeam should display error message when input is not valid', function(done) {
            $("#content").html("<li id='new-team'><input value='theTarget'><a id='me' href='#'>créer</a></li>");
            allTeams.initNewTeam('#new-team');
            $('#me').click();
            //TODO can't test the window.location.href properly
            done();
        });
    });

}());
