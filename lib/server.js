var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var connectLivereload = require('connect-livereload');
var tinyLr = require('tiny-lr');
var watch = require('watch');
var path = require('path');

var util = require('./util');
var middleware = require('./middleware');

exports.start = function(config) {
    if (config.livereload) {
        var lrServer = tinyLr();
        lrServer.listen(config.livereloadPort, '127.0.0.1');
        watch.watchTree(config.root, function(filename) {
            lrServer.changed({
                body: {
                    files: filename
                }
            });
        });
    }

    var app = connect();

    if (config.livereload) {
        app.use(connectLivereload({
            port: config.livereloadPort
        }));
    }

    if (config.rewrite) {
        app.use(middleware.rewriteHandler(config));
    }

    app.use(middleware.htmlHandler(config));

    app.use(middleware.ajaxHandler(config));

    app.use(serveStatic(config.root, {
        index: false,
        extensions: ['html', 'htm']
    }));

    app.use(serveIndex(config.root));

    http.createServer(app).listen(config.port);

    console.log('Started web server on http://localhost:' + config.port);
}
