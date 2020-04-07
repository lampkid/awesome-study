const fs = require('fs');
const path = require('path');
function traverse_recursive(dir, preCondition, postCallback) {
  let childFiles = [];
  try {
    childFiles = fs.readdirSync(dir);
  } catch (e) {
    console.log('get app dir error:', e);
  }

  for (let length = childFiles.length, i = 0; i < length; i++) {
    const  childFile = childFiles[i];
    const absPath = path.join(dir, childFile);
    const stat = fs.statSync(absPath)
    if (stat.isDirectory()) {
      traverse_recursive(absPath, preCondition, postCallback);
    } else if (stat.isFile()) {
      typeof postCallback === 'function'
        && typeof preCondition === 'function'
        &&  preCondition(absPath)
        && postCallback(absPath);
    }
  }
}

function syncdb(appPath) {
  traverse_recursive(appPath, function(filePath) {
    return filePath.indexOf('.model.') !== -1;
  }, function(filePath) {
    const model = require(filePath);
    try {
      if (typeof model.sync === 'function') {
        model.sync();
      }
    } catch (err) {
      console.warn(filePath, err);
    }
  });
}

module.exports = syncdb;


