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

        it('initPersonsDeletion should add onClickListener to all &times;', function(done) {
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
    });


}());
