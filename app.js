var async = require('async');
var bs = require('browser-sync').create('jade-stylus-templating');
var fs = require('fs');
var jade = require('jade');
var path = require('path');
var stylus = require('stylus');

var publicPath = 'public';
var callback = function(err) {
  if (err) {
    console.error(err);
  }
};

if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath);
}

bs.watch(['assets/stylesheets/*.styl', 'assets/templates/*.jade'], function(event, file) {
  if (event === 'add' || event === 'change') {
    if (path.extname(file) === '.styl') {
      return async.waterfall([
        function(callback) {
          return fs.readFile(file, callback);
        },
        function(data, callback) {
          return stylus.render(data.toString(), callback);
        },
        function(css, callback) {
          return fs.writeFile('public/index.css', css, callback);
        }
      ], callback);
    } else if (path.extname(file) === '.jade') {
      return async.waterfall([
        function(callback) {
          var html = jade.renderFile(file);
          return callback(null, html);
        },
        function(html, callback) {
          return fs.writeFile('public/index.html', html, callback);
        }
      ], callback);
    }
  }
});

bs.watch(['public/*.html', 'public/*.css']).on('change', bs.reload);

bs.init({
  server: {
    baseDir: publicPath,
    index: 'index.html'
  }
});
