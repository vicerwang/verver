var http = require('http');
var path = require('path');
var bs = require('browser-sync').create();
var _ = require('lodash');

var util = require('./util');
var middleware = require('./middleware');

exports.start = function(config) {
    var serverOpts = {
        baseDir: config.root,
        directory: true,
        middleware: [
            middleware.rewriteHandler(config),
            middleware.htmlHandler(config),
            middleware.ajaxHandler(config)
        ]
    };
    serverOpts = _.merge(serverOpts, config.serverOpts);

    var bsOpts = {
        port: config.port,
        server: serverOpts,
    };
    if (config.livereload) {
        bsOpts.files = config.root + '/**/*.*';
    }

    bs.init(bsOpts);
}
