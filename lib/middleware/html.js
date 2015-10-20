var fs = require('fs');
var path = require('path');
var Engine = require('velocity').Engine;
var _ = require('lodash');

var util = require('../util');

module.exports = function(config) {
    return function(req, res, next) {
        var pathInfo = util.wrapPath(req.url, config.root);
        if (pathInfo.ext != '.html') {
            return next();
        }

        var htmlExists = fs.existsSync(pathInfo.full);
        if (!htmlExists) {
            return next();
        }

        var commonMockPath = path.join(pathInfo.root, 'mock/velocity/commonmock/common.js');
        var commonMock = getMock(commonMockPath);
        var mockPath = pathInfo.full.replace('/template/', '/mock/velocity/') + '.js';
        var mock = getMock(mockPath);
        mock = _.merge(commonMock, mock);

        var html = new Engine({
            root: path.join(pathInfo.root, 'template'),
            template: pathInfo.full
        }).render(mock);
        res.writeHead(200, {
            'Content-Type': 'text/html;charset=UTF-8'
        });
        res.end(html);
    }
}

function getMock(mockPath) {
    var mock;

    if (fs.existsSync(mockPath)) {
        mock = require(mockPath);
        delete require.cache[mockPath];
    } else {
        mock = {};
        util.writeFile(mockPath, 'module.exports = {};', function(err) {
            err ?
                console.error('Create mock file failed. Path: %s, Error: %s', mockPath, err) :
                console.info('Create mock file successfully. Path: %s', mockPath);
        });
    }

    return mock;
}
