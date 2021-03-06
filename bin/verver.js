#!/usr/bin/env node

var Liftoff = require('liftoff');
var program = require('commander');

var server = require('../lib/server');

program
  .version('0.0.1')
  .option('-p, --port <int>', 'server listen port', parseInt)
  .option('-r, --root <path>', 'server root directory')
  .parse(process.argv);

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

    server.start(config);
});
