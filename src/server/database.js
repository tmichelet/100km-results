/*global console */

(function() {
    "use strict";

    var Knex = require('knex');
    var fs = require('fs');

    var createDB = function(path, callback) {
        fs.writeFile(path, "", function(err) {
            if (err) throw err;
            initDB(path, function() {
                createTables(callback);
            });
        });
    };
    exports.createDB = createDB;

    exports.dropDB = function(path, callback) {
        fs.unlink(path, function(err) {
            if (err) throw err;
            exports.DB = undefined;
            callback();
        });
    };

    var initDB = function(path, callback) {
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
        getTeam(teamname, function(data) {
            if(Object.keys(data).length === 0) {
                exports.DB('teams').insert({teamname: teamname, bibs: bibs, names: names })
                .exec(function(err, reps) {
                    if (err) throw err;
                    callback(reps);
                });
            }
            else {
                exports.DB('teams').where('teamname', '=', teamname).update({'bibs': bibs, 'names': names})
                .exec(function(err, reps) {
                    if (err) throw err;
                    callback();
                });
            }
        });
    };

    var getTeam = function(name, callback) {
        exports.DB('teams').select('teamname', 'bibs', 'names').where('teamname', '=', name)
        .exec(function(err, resp) {
            if (err) throw err;
            callback(resp[0] || {});
        });
    };
    exports.getTeam = getTeam;

    exports.getTeamsNames = function (callback) {
        exports.DB('teams').select('teamname').where('bibs', '!=', '[]').exec(function(err, resp) {
            if (err) throw err;
            callback({'teams': resp || []});
        });
    };

}());
