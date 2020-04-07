const uniqid = require('uniqid');
const OSS = require('ali-oss');
const fs = require('fs');

function getFileExt(filename, mineType='') {
  const tokens = filename.split('.');
  let ext;
  if (tokens.length > 1) {
    ext = tokens.pop();
  } else {
    const mineTypeTokens = mineType.split('/')
    ext = mineTypeTokens.length > 1 ? mineTypeTokens.pop() : undefined;
  }
  return ext;
}

function getFileName(mineType) {
  // const salt = 'saltformyself';
  // const rand = Math.random() + +new Date() + salt + 'minetype' + mineType;
  const filename = uniqid();
  return filename;
}



class FileService {
  constructor() {
    this.client = new OSS({
      region: 'oss-cn-beijing',
      accessKeyId: 'your key id',
      accessKeySecret: 'your secret',
      bucket: 'your bucket'
    });
  }

  async upload(filename, filecontent) {
    try {
      let result = await this.client.put(`filename`, filecontent)
      console.log(result);
    } catch(e) {
      throw e;
    }

    return result;
    
  }

  async uploadLocalFile(filename, filepath) {
    try {
      let result = await this.client.put(filename, filepath)
      const { name, url, res } = result;
      console.log('upload result----------:', result);
      await this.rmFile(filepath);
      if (res.status === 200) {
        return { name, url, url_https: url.replace(/^http:/, 'https:') };
      }
      throw new Error(res.statusMessage); 
    } catch(e) {
      throw e;
    }

    
  }

  readFile(pFilepath) {
    let filepath = pFilepath;
    if (pFilepath.path) {
      filepath = pFilepath.path;
    }
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      })
    });
  }

  async rmFile(filepath) {
    return new Promise((resolve, reject) => {
      fs.unlink(filepath, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      })
    });
  }

  getFullFileName (filedata, dir='app') {
    const filename = filedata.name;
    const mineType = filedata.mineType;
    const fileext = getFileExt(filename, mineType);
    const uniqFilename = getFileName();

    let fullFileName = uniqFilename;

    if (fileext) {
      fullFileName = uniqFilename + '.' + fileext;
    }

    return `${dir}/${fullFileName}`;
  }

}



module.exports = FileService;
