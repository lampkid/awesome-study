const Client = require('scp2').Client;
const pathlib = require('path');
const fs = require('fs');



module.exports = class CDNService {
  constructor(options = {}) {
    const basePath = options.basePath || '/usr/local/nginx/h5/';
    const dir = options.dir || 'pages';
    this.options = {
      port: 22,
      host: 'your host ip', // 10.2.98.226
      username: 'work',
      //password: '',
      privateKey: fs.readFileSync(pathlib.resolve(process.env.HOME, './.ssh/id_rsa')),

      domain: 'https://your.cdn.domain',
      basePath,
      dir,
      path: pathlib.resolve(basePath, dir),
      ...options
    };

    const { port, host, username, privateKey } = this.options;

    const scpOptions = {
      port, host, username, privateKey

    };
    this.client = new Client(scpOptions);
  }

  getURL(filename) {
    // todo 用专门的url库处理
    return `${this.options.domain}/${this.options.dir}/${filename}`
  }

  upload(filename, fileContent) {
    return new Promise((resolve, reject) => {
      const dest = pathlib.resolve(this.options.path, filename);
      this.client.write({
        destination: dest,
        content: fileContent
      }, (err) => {
        if (!err) {
          const url = this.getURL(filename);
          resolve(url);
          return;
        }
        reject();
      });
    });
  }

  uploadLocalFile(filename, filepath) {
    return new Promise((resolve, reject) => {
      this.client.upload(filepath, pathlib.resolve(this.options.path, filename), (err) => {
        if (!err) {
          const url = this.getURL(filename);
          resolve(url);
          return;
        }
        reject();
      })
    });
  }

  generateFileName(fileext, dir = 'banner', defaultFilename) {

    let fullFileName = defaultFilename || this.getFileName();

    if (fileext) {
      fullFileName = fullFileName + '.' + fileext;
    }

    return `${dir}/${fullFileName}`;
  }

  getFullFileName (filedata, dir='app') {
    const filename = filedata.name;
    const mineType = filedata.mineType;
    const fileext = this.getFileExt(filename, mineType);
    const uniqFilename = this.getFileName();

    let fullFileName = uniqFilename;

    if (fileext) {
      fullFileName = uniqFilename + '.' + fileext;
    }

    return `${dir}/${fullFileName}`;
  }

  getFileExt(filename, mineType='') {
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

  getFileName(mineType) {
    const uniqid = require('uniqid');
    const filename = uniqid();
    return filename;
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

}
