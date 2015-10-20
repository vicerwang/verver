#!/usr/bin/env node

var Liftoff = require('liftoff');
var program = require('commander');
var _ = require('lodash');

var server = require('../server');

program
  .version('0.0.1')
  .option('-p, --port <int>', 'server listen port', parseInt)
  .option('-r, --root <path>', 'server root directory')
  .parse(process.argv);

var defaults = {
    root: process.cwd(),
    port: 3000,
    livereload: true,
    livereloadPort: 35729,
    rewrite: null,
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
    cwd: program.root,
}, function(env) {
    var config = {};
    if (env.configPath) {
        config = require(env.configPath);
        delete require.cache[env.configPath];
        config.root = env.cwd;
    }
    if (program.port) {
        config.port = program.port;
    }
    config = _.merge({}, defaults, config)

    server.start(config);
});
