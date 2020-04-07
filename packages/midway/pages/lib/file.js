const fs = require('fs');

const mkdirpOriginal = require('mkdirp');

module.exports.readFile = function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

module.exports.writeFile = function writeFile(filename, content, options) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, content, options, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

module.exports.mkdirp = function(dirname) {
  return new Promise((resolve, reject) => {
    mkdirpOriginal(dirname, (err) => {
      if (err) {
        console.log('mkdir error', dirname);
        return reject(err);
      }
      resolve();
    });
  });
}
