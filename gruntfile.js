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
        server.start(function() {
            grunt.log.write('server started');            
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
        var options = globalLintOptions();
        options.browser = true;
        return options;
    }
};