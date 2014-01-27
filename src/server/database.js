/*global console */

(function() {
    "use strict";

    var Knex = require('knex');
    var fs = require('fs');

    var DEFAULT_DB_PATH = './100km.sqlite';
    var DB;
    exports.DB = DB;

    exports.createDB = function(path, callback) {
        fs.writeFile(path, "", function(err) {
            if (err) throw err;
            initDB(path, callback);
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
        DB = Knex.initialize({
            client: 'sqlite3',
            connection: {
                filename: path
            }
        });
        var table = function (table) {
            table.string('name').primary();
            table.string('bibs');
            table.timestamps();
        };
        DB.schema.createTable('teams', table).then(function () {
            exports.DB = DB;
            callback();
        });
    };
    exports.initDB = initDB;

    exports.saveTeam = function(name, bibs, callback) {
        exports.DB('teams').insert({name: name, bibs: bibs })
        .exec(function(err, reps) {
            if(err) { // already exists -> update
                exports.DB('teams').where('name', '=', name).update({'bibs': bibs})
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
        exports.DB('teams').select('name', 'bibs').where('name', '=', name)
        .exec(function(err, resp) {
            callback(resp[0]);
        });
    };

}());
