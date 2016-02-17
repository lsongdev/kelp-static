const fs   = require('fs');
const url  = require('url');
const path = require('path');
const mime = require('mime');
/**
 * [exports description]
 * @param  {[type]} root    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
module.exports = function KelpStatic(root, options){
  options = options || {};
  var defaults = {
    index: 'index.html'
  };
  for(var k in options){
    defaults[ k ] = options[ k ];
  }
  options = defaults;
  /**
   * [function description]
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  return function(req, res, next){
    var filename = url.parse(req.url).pathname;
    if(filename.endsWith('/')) filename += options.index;
    filename = path.join(path.resolve(root), filename);
    fs.stat(filename, function(err, stat){
      if(err) return next();
      if(stat.isDirectory()){
        res.writeHead(301, {
          'Location': req.url + '/'
        });
        return res.end();
      }
      var type = mime.lookup(filename);
      var charset = mime.charsets.lookup(type);
      res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
      res.setHeader('Content-Length', stat.size);
      fs.createReadStream(filename).pipe(res);
    });
  };
};
