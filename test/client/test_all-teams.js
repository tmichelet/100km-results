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
            $("#content").html("<li id='new-team'><input value='the target'><button id='me' href='#'>créer</button></li>");
            assert.equal(allTeams.extractNewTeamName('#new-team'), 'the target');
            done();
        });
        it('extractNewTeamName should raise if non appropriate caracters', function(done) {
            $("#content").html("<li id='new-team'><input value='_wrong'><button id='me' href='#'>créer</button></li>");
            try {
                allTeams.extractNewTeamName('#new-team');
            }
            catch(err) {
                assert(err.indexOf("_") !== -1);
                $("#content").html("<li id='new-team'><input value=''><button id='me' href='#'>créer</button></li>");
                try {
                    allTeams.extractNewTeamName('#new-team');
                }
                catch(err) {
                    assert(err.indexOf("nom d'équipe") !== -1);
                    $("#content").html("<li id='new-team'><input value='team;name'><button id='me' href='#'>créer</button></li>");
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
                "<li id='new-team'><input value='existingTeam'><button id='me' href='#'>créer</button></li>\
                <li><a href='existingTeam'>existingTeam</button></li>\
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
                "<li id='new-team'><input value=''><button id='me' href='#'>créer</button></li>\
                <li><a href='existingTeam'>existingTeam</button></li>\
            ");
            assert.deepEqual(allTeams.extractExistingTeamName('#new-team'), ["existingTeam"]);
            done();
        });

        it('initNewTeam should display error message when input is not valid', function(done) {
            $("#content").html(
                "<li id='new-team'><input value='existingTeam'><button id='me' class='createButton' href='#'>créer</button><span id='error'></span></li>\
                <li><a href='existingTeam'>existingTeam</button></li>\
            ");
            allTeams.initNewTeam('#new-team');
            $('#me').click();
            assert.equal("L'équipe existe déjà", $('#error').text());
            done();
        });
        it('initNewTeam should add onClickListener to the a element, which triggers a redirection', function(done) {
            $("#content").html("<li id='new-team'><input value='theTarget'><button id='me' class='createButton' href='#'>créer</button></li>");
            allTeams.initNewTeam('#new-team');
            window.location.href = "../../foo/";
            $('#me').click();
            assert(window.location.href.match("/foo/theTarget/edit$"));
            done();
        });
        it('initNewTeam should add onClickListener to the input element, which triggers the submit if enter is pressed', function(done) {
            $("#content").html(
                "<li id='new-team'><input value='theTarget' id='me'><button href='#'>créer</button><span id='error'></span></li>\
                <li><a href='existingTeam'>existingTeam</button></li>\
            ");
            allTeams.initNewTeam('#new-team');
            var press = $.Event("keypress");
            press.which = 13;
            var beforeLength = window.history.length;
            window.location.href = "../../foo/";
            $('#me').trigger(press);
            assert.equal(window.history.length, beforeLength+1);
            assert(window.location.href.match("/foo/theTarget/edit$"));
            done();
        });
    });

}());
