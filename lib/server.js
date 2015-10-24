var http = require('http');
var path = require('path');
var fs = require('fs');
var bs = require('browser-sync').create();
var less = require('less');
var CleanCSS = require('clean-css');
var UglifyJS = require('uglify-js');
var _ = require('lodash');

var util = require('./util');
var middleware = require('./middleware');

var defaults = {
    root: process.cwd(),
    port: 3000,
    livereload: true,
    watchExtension: [ '.html', '.css', '.js' ],
    rewrite: null,
    jsonp: 'jsoncallback',
    serverOpts: null,
    less: {},
    cleanCSS: {},
    uglifyJS: {}
}

exports.start = function(config) {
    config = _.merge({}, defaults, config);

    var serverOpts = {
        baseDir: config.root,
        directory: true,
        middleware: [
            middleware.htmlHandler(config),
            middleware.ajaxHandler(config)
        ]
    };
    if (config.rewrite) {
        serverOpts.middleware.unshift(middleware.rewriteHandler(config));
    }

    serverOpts = _.merge(serverOpts, config.serverOpts);

    var bsOpts = {
        port: config.port,
        server: serverOpts
    };
    if (config.livereload) {
        bsOpts.files = config.watchExtension.map(function(ext) {
            if (ext[0] !== '.') {
                ext = '.' + ext;
            }
            return path.join(config.root, '/**/*' + ext);
        });
    }

    bs.init(bsOpts);

    if (config.less) {
        bs.watch(path.join(config.root, '/**/*.less')).on('change', function(lessPath) {
            fs.readFile(lessPath, 'utf8', function(err, content) {
                if (err) {
                    console.log('Read less file failed. Path: %s, Error: %s', lessPath, err);
                    return;
                }

                less.render(content, config.less, function(err, tree) {
                    if (err) {
                        console.log('Compile less file failed. Path: %s, Error: %s', lessPath, err);
                        return;
                    }

                    var cssPath = setExt(lessPath, '.css');
                    fs.writeFile(cssPath, tree.css, function(err) {
                        if (err) {
                            console.log('Write css file failed. Path: %s, Error: %s', cssPath, err);
                        }

                        bs.reload();
                    });
                });
            });
        });
    }

    if (config.cleanCSS) {
        bs.watch(path.join(config.root, '/**/*.css'), { ignored: /.*\.min\.css$/ }).on('change', function(cssPath) {
            fs.readFile(cssPath, 'utf8', function(err, content) {
                if (err) {
                    console.log('Read css file failed. Path: %s, Error: %s', cssPath, err);
                    return;
                }

                var minified = new CleanCSS(config.cleancss).minify(content).styles;
                var minifiedPath = setExt(cssPath, '.min.css');
                fs.writeFile(minifiedPath, minified, function(err) {
                    if (err) {
                        console.log('Write min.css file failed. Path: %s, Error: %s', minifiedPath, err);
                    }

                    bs.reload();
                });
            });
        });
    }

    if (config.uglifyJS) {
        bs.watch(path.join(config.root, '/**/*.js'), { ignored: /.*(\.min\.js$|\/mock\/(ajax|velocity)\/.*)/ }).on('change', function(jsPath) {
            var result = UglifyJS.minify(jsPath, config.uglifyJS);
            var uglifyPath = setExt(jsPath, '.min.js');
            fs.writeFile(uglifyPath, result.code, function(err) {
                if (err) {
                    console.log('Write min.js file failed. Path: %s, Error: %s', uglifyPath, err);
                }

                bs.reload();
            });
        });
    }
}

function setExt(filePath, newExt) {
    return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + newExt);
}
