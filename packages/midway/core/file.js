module.exports.readFile = function(pFilepath) {
  let filepath = pFilepath;
  if (pFilepath.path) {
    filepath = pFilepath.path;
  }
  return new Promise((resolve, reject) => {
    require('fs').readFile(filepath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    })
  });
}

function getFileExtByFilename(filename, mineType='') {
  const tokens = filename.split('.');
  let ext;
  if (tokens.length > 1) {
    ext = tokens.pop();
  }
  return ext;
}

function getFileExtByMineType(mineType) {
  const mineTypeTokens = mineType.split('/')
  const ext = mineTypeTokens.length > 1 ? mineTypeTokens.pop() : undefined;
  return ext;
}

module.exports.getFileExt = function(filedata) {
  const filename = filedata.name;
  const mineType = filedata.type;
  const fileext = getFileExtByFilename(filename) || getFileExtByMineType(mineType);
  return fileext;
}

function getFileSize(filedata, unit = 'M') {
  const filesize = filedata.size;
  let unitsize;
  switch(unit) {
    case 'M':
      unitsize = (filesize / 1000000.0).toFixed(1);
      break;
    case 'KB':
      unitsize = (filesize/1000.0).toFixed(1);
      break;
    default:
      unitsize = filesize;
  }
  return unitsize;
}

module.exports.getFileSize = getFileSize;

module.exports.validateFileSize = function(filedata, max = 10, unit = 'M') {
  const size = getFileSize(filedata, unit);
  const isNormal = size <= max;
  if (!isNormal) {
    throw new Error(`file size error, file size must < ${max}${unit}`);
  }
}
