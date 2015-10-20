#!/usr/bin/env node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var _ = require('lodash');
var server = require('../server');

var defaults = {
    root: process.cwd(),
    port: 3000,
    livereload: true,
    livereloadPort: 35729,
    proxy: null,
    jsonp: 'jsoncallback'
}

var cli = new Liftoff({
    name: 'verver',
    processTitle: 'verver',
    moduleName: 'verver',
    configName: 'verver',
    extensions: {
        '.js': null
    }
});

cli.launch({
    cwd: argv.r || argv.root,
    configPath: argv.f || argv.file,
}, function(env) {
    var config = {};
    if (env.configPath) {
        config = require(env.configPath);
        delete require.cache[env.configPath];
        config.root = env.cwd;
    }
    var port = argv.p || argv.port;
    if (port && _.isNumber(port)) {
        config.port = port;
    }
    config = _.merge({}, defaults, config)

    server.start(config);
});
