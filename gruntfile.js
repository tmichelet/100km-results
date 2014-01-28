module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-mocha-test');

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
        }
    });

    grunt.registerTask('default', ['jshint', 'mochaTest']);

    grunt.registerTask('watch', 'starts the server', function() {
        var done = this.async();
        var server = require('./src/server/server.js');
        server.start(DEFAULT_DB_PATH, function() {
            grunt.log.write('server started');
        });
    });

    grunt.registerTask('create-database', 'creates the database. WARNING: will drop all the data', function() {
        var done = this.async();
        var database = require('./src/server/database.js');
        database.dropDB(DEFAULT_DB_PATH, function() {});
        database.createDB(DEFAULT_DB_PATH, function() {
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
            trailing: true
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
        return options;
    }

    var DEFAULT_DB_PATH = './100km.sqlite';
};