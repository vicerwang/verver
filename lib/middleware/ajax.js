var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');

var util = require('../util');

module.exports = function(config) {
    return function(req, res, next) {
        var pathInfo = util.wrapPath(req.url, config.root);
        if (!(req.headers['x-requested-with'] && (req.headers['x-requested-with'] == 'XMLHttpRequest'))) {
            return next();
        }

        var mockPath = path.join(pathInfo.root, '/mock/ajax', pathInfo.relative + '.js');
        var mockExists = fs.existsSync(mockPath);
        if (mockExists) {
            var mock = JSON.stringify(require(mockPath));
            delete require.cache[mockPath];

            var query = url.parse(req.url).query;
            var callback = query ? qs.parse(query)[config.jsonp] : undefined;
            if (req.method == 'GET' && callback) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain;charset=UTF-8'
                });
                res.end(callback + '(' + mock + ')');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json;charset=UTF-8'
                });
                res.end(mock);
            }
        } else {
            util.writeFile(mockPath, '{}', function(err) {
                err ?
                    console.error('Create mock file failed. Path: %s, Error: %s', mockPath, err) :
                    console.log('Create mock file successfully. Path: %s', mockPath);
            });
            next();
        }
    }
}
