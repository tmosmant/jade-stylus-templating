var async = require('async');
var bs = require('browser-sync').create('pug-stylus-templating');
var fs = require('fs');
var pug = require('pug');
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

bs.watch('assets/*.styl', function(event, file) {
  if (event === 'add' || event === 'change') {
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
  }
});

bs.watch('assets/*.pug', function(event, file) {
  if (event === 'add' || event === 'change') {
      return async.waterfall([
        function(callback) {
          var html = pug.renderFile(file);
          return callback(null, html);
        },
        function(html, callback) {
          return fs.writeFile('public/index.html', html, callback);
        }
      ], callback);
  }
});

bs.watch(['public/*.html', 'public/*.css']).on('change', bs.reload);

bs.init({
  server: {
    baseDir: publicPath,
    index: 'index.html'
  }
});
