module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        jshint: {
            browser: {
                options: browserLintOptions(),
                src: "src/client/**/*.js"
            },
            node: {
                options: nodeLintOptions(),
                src: ["src/*.js", "src/server/**/*.js", "*.js", "test/**/*.js"]
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            },
        },
        browserify: {
            dist: {
                files: {
                    'src/client/build/edit-team.js': ['src/client/main-edit-team.js'],
                    'src/client/build/all-teams.js': ['src/client/main-all-teams.js']
                }
            }
        }
    });

    grunt.registerTask('default', ['clean', 'browserify', 'jshint', 'mochaTest']);

    grunt.registerTask('clean', 'clean build folder', function() {
        var fs = require('fs');
        var path = 'src/client/build/';
        fs.exists(path, function(exists) {
            if(exists) {
                fs.readdirSync(path).forEach(function(file,index) {
                    fs.unlink(path + file);
                });
            }
            else {
                fs.mkdir(path);
            }
        });
    });

    grunt.registerTask('watch', 'starts the server', function() {
        var done = this.async();
        var server = require('./src/server/server.js');
        server.start(function() {
            grunt.log.write('server started');
        });
    });

    grunt.registerTask('create-database', 'creates the database. WARNING: will drop all the data', function() {
        var done = this.async();
        var database = require('./src/server/database.js');
        var utils = require('./src/server/utils.js');
        database.dropDB(utils.defaultOptions.databasePath, function() {});
        database.createDB(utils.defaultOptions.databasePath, function() {
            grunt.log.write('database created');
            done();
        });
    });

    function globalLintOptions() {
        return {
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: false,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true,
            multistr: true
        };
    }

    function nodeLintOptions() {
        var options = globalLintOptions();
        options.node = true;
        return options;
    }

    function browserLintOptions() {
        var options = nodeLintOptions();
        options.browser = true;
        options.ignores = "src/client/build/**/*.js";
        return options;
    }

    var DEFAULT_DB_PATH = './100km.sqlite';
};