var url = require('url');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

exports.wrapPath = function(reqUrl, root) {
    var relative = url.parse(reqUrl).pathname;
    var full = path.join(root, relative);
    var ext = path.extname(full).toLowerCase();
    var fullNoExt = full.substr(0, full.length - ext.length);

    return {
        relative: relative,
        full: full,
        ext: ext,
        fullNoExt: fullNoExt,
        root: root
    }
}

exports.writeFile = function() {
    var args = arguments;
    mkdirp(path.dirname(args[0]), function() {
        fs.writeFile.apply(fs, args);
    });
}
