	var grunt = require('grunt');
        var server = require('./src/server/server.js');
        server.start(function() {
            grunt.log.write('server started');
        });

