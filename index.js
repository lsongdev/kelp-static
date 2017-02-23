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
  for(var k in options)
    defaults[ k ] = options[ k ];
  options = defaults;
  /**
   * [function description]
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  return function(req, res, next){
    var filename = decodeURIComponent(url.parse(req.url).pathname);
    if(filename.endsWith('/') && typeof options.index === 'string') 
      filename += options.index;
    filename = path.join(path.resolve(root), filename);
    fs.stat(filename, function(err, stat){
      if(err) return next(err);
      if(stat.isDirectory()){
        if(options.index === true)
          res.setHeader('Content-Type', 'text/html');
          return renderDirectory(filename, res.end);
        res.writeHead(301, {
          'Location': req.url + '/'
        });
        return res.end();
      }
      if(new Date(req.headers['if-modified-since']) - stat.mtime == 0){
        res.writeHead(304);
        return res.end();
      }
      var type = mime.lookup(filename);
      var charset = mime.charsets.lookup(type);
      res.setHeader('Last-Modified', stat.mtime);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
      fs.createReadStream(filename).pipe(res);
    });
  };
};
/**
 * [renderDirectory description]
 * @param  {[type]}   dir      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function renderDirectory(dir, callback){
  var content = '', cwd = process.cwd();
  content += '<h1>Index of '+ dir.replace(cwd, '') +'</h1>';
  content += '<hr />';
  fs.readdir(dir, function(err, files){
    content += '<table width="50%">';
    content += '<tr>';
    content += '<td><a href="..">..</a></td>';
    content += '</tr>';
    files.map(function(filename){
      var stat = fs.statSync(path.join(dir, filename));
      content += '<tr>';
      content += '<td><a href="' + filename + '">' + filename + '</a></td>';
      content += '<td>' + (stat.mtime || '-')      +                '</td>';
      content += '<td>' + (stat.size        )      +                '</td>';
      content += '</tr>';
    }).join('');
    content += '</table>';
    content += '<hr/>';
    content += 'Powered by <a href="https://github.com/song940/kelp-static" >kelp-static</a>';
    callback(content);
  });
}
