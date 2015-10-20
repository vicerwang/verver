module.exports = function(config) {
    return function(req, res, next) {
        var rewriteUrl = config.rewrite[req.url];
        if (rewriteUrl) {
        	req.url = rewriteUrl;
        }
        next();
    }
}
