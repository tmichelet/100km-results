/*global describe, it, beforeEach, afterEach, window */

(function() {
    "use strict";

    var assert = require("assert");
    var test_utils = require('../server/test_utils.js');

    var html = '<html><body><div id="content"></div></body></html>';
    global.window = require("jsdom").jsdom(html).createWindow();
    global.document = window.document;
    var editTeam = require(test_utils.SRC_PATH + '/client/edit-team.js');

    var $ = require('jquery-browserify');

    describe('test_edit-team', function() {

        afterEach(function() {
            $("#content").html("");
        });

        it('removeLineOf should remove closest tr', function(done) {
            $("#content").html(
                "<table><tbody>\
                    <tr id='notatarget'>    <td></td>  <td></td>            </tr>\
                    <tr id='target'>        <td></td>   <td id='me'></td>   </tr>\
                </tbody></table>"
            );
            editTeam.removeLineOf('#me');
            assert($('#target').length === 0);
            assert($('#notatarget').length > 0);
            done();
        });

        it('initPersonsDeletion should add onClickListener to all td.deleteLine children, which triggers removeLineOf', function(done) {
            $("#content").html(
                "<table><tbody>\
                    <tr id='notatarget'>    <td></td>               <td id='metoo' class='deleteLine'>x</td>    </tr>\
                    <tr id='target'>        <td id='notme'></td>    <td id='me' class='deleteLine'>x</td>       </tr>\
                </tbody></table>"
            );
            editTeam.initPersonsDeletion('table');
            assert($('#target').length > 0);
            $('#target').click();
            assert($('#target').length > 0);
            $('#notme').click();
            assert($('#target').length > 0);
            $('#me').click();
            assert($('#target').length === 0);
            assert($('#notatarget').length > 0);
            $('#metoo').click();
            assert($('#notatarget').length === 0);
            done();
        });

        it('extractTeamData should generate appropriate url for an empty table', function(done) {
            $("#content").html("<table><tbody></tbody></table>");
            assert.equal(editTeam.extractTeamData('table'), './edit/[]/[]');
            done();
        });
        it('extractTeamData should generate appropriate url for a normal table', function(done) {
            $("#content").html(
                "<table><tbody>\
                    <tr>    <td>1</td>  <td>name one</td>   <td>x</td>  </tr>\
                    <tr>    <td>10</td> <td>second</td>     <td>x</td>  </tr>\
                </tbody></table>"
            );
            assert.equal(editTeam.extractTeamData('table'), './edit/[1,10]/[name one,second]');
            done();
        });

        it("extractPersonData should drop '[', ']', '_' and ',' characters", function(done) {
            $("#content").html("<tr>    <td>1</td>  <td>n[a]m,e_ one</td>   <td>x</td>  </tr>");
            test_utils.assertJsonEqual(editTeam.extractPersonData('tr'), {bib:'1', name:'name one'});
            done();
        });

        it('initSubmitNewTeam should add onClickListener to the submit element, which triggers a get request', function(done) {
            $("#content").html(
                "<table id='bibs'><tbody>\
                    <tr>    <td>1</td>  <td>name one</td>   <td>x</td>  </tr>\
                    <tr>    <td>10</td> <td>second</td>     <td>x</td>  </tr>\
                </tbody></table>\
                <a id='submit'></a>"
            );
            editTeam.initSubmitNewTeam('#submit');
            assert(endsWith(window.location.href, '/test/client/test_edit-team.js'));
            var data = mock($, 'get', function() { $("#submit").click(); });
            assert.equal(data.args, './edit/[1,10]/[name one,second]');
            assert(endsWith(window.location.href, '/test/client/'));
            done();
        });
    });

    var endsWith = function(string, suffix) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
    };

    var mock = function(object, func, action) {
        var formerFunction = object[func];
        var data = {};
        var newFunction = function(args, callback) {
            data.args = args;
            data.callback = callback;
        };
        object[func] = newFunction;
        action();
        data.callback();
        object[func] = formerFunction;
        return data;
    };
}());
