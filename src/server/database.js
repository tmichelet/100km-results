/*global console */

(function() {
    "use strict";

    var Knex = require('knex');
    var fs = require('fs');

    exports.DEFAULT_DB_PATH = './100km-tests.sqlite';

    exports.createDB = function(path, callback) {
        fs.writeFile(path, "", function(err) {
            if (err) throw err;
            initDB(path, function() {
                createTables(callback);
            });
        });
    };

    exports.dropDB = function(path, callback) {
        fs.unlink(path, function(err) {
            if (err) throw err;
            exports.DB = undefined;
            callback();
        });
    };

    var initDB = function(path, callback) {
        if(path === undefined || path === null) path = exports.DEFAULT_DB_PATH;
        exports.DB = Knex.initialize({
            client: 'sqlite3',
            connection: {
                filename: path
            }
        });
        callback();
    };
    exports.initDB = initDB;

    var createTables = function(callback) {
        var table = function (table) {
            table.string('teamname').primary();
            table.string('bibs');
            table.string('names');
            table.timestamps();
        };
        exports.DB.schema.createTable('teams', table).then(function () {
            callback();
        });
    };

    exports.saveTeam = function(teamname, bibs, names, callback) {
        exports.DB('teams').insert({teamname: teamname, bibs: bibs, names: names })
        .exec(function(err, reps) {
            if(err) { // already exists -> update
                exports.DB('teams').where('teamname', '=', teamname).update({'bibs': bibs, 'names': names})
                .exec(function(err, reps) {
                    callback();
                });
            }
            else if(reps) {
                callback();
            }
        });
    };

    exports.getTeam = function(name, callback) {
        exports.DB('teams').select('teamname', 'bibs', 'names').where('teamname', '=', name)
        .exec(function(err, resp) {
            if(err) console.log(err);
            callback(resp[0] || {});
        });
    };

}());
