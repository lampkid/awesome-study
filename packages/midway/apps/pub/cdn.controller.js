'use strict';

const pathlib = require('path');
const BaseController = require('../../lib/controller');

const CDNService = require('./cdn.service');

const { getInstalledPath } = require('get-installed-path');
// const { generateContent, htmlMinify } = require('pages');
const { generateContent, htmlMinify, emitFile } = require('../../pages/lib');

class CdnController extends BaseController {
  constructor() {
    super();

    this.cdnService = new CDNService();
    this.cdn2Service = new CDNService({ host: 'your host ip' });
  }

  async indexAction(ctx, next) {
  }

  async uploadAction(ctx, next) {

    const filedata = ctx.request.files.file || ctx.request.files.filedata;
    const tmpFilepath = filedata.path;

    let uploadRet;

    try {

      const filename = this.cdnService.getFullFileName(filedata);
      const url = await this.cdnService.uploadLocalFile(filename, tmpFilepath);
      await this.cdn2Service.uploadLocalFile(filename, tmpFilepath);

      uploadRet = {
        url
      }; 
    } catch(e) {
      // 捕获不到crash错误
    }

    ctx.body = this.decorateResponse(uploadRet)
  }

  async generatePageAction(ctx, next) {
    const { name = '', data, publicPath = '', template = 'images' } = this.fetchParams(['data', 'publicPath', 'template', 'name']);
    // 先await 同步, 后续可先返回结果再执行
    // const pagesPath = await getInstalledPath('pages', { local: true });
    const pagesPath = pathlib.resolve(process.cwd(), 'pages');
    const html = htmlMinify(await generateContent({
      template: pathlib.resolve(pagesPath, `templates/${template}.html`),
      data: {
        ...data
      },
      publicPath
    }));

    const filename = this.cdnService.generateFileName('html', 'banner', name);
    const tmpFile = `/tmp/midway/${filename}`;
    await emitFile(html, tmpFile);
    // todo: upload 底层接口存在问题
    // const url = await this.cdnService.upload(filename, html);
    const url = await this.cdnService.uploadLocalFile(filename, tmpFile);
    await this.cdn2Service.uploadLocalFile(filename, tmpFile);

    await this.cdnService.rmFile(tmpFile);

    const resData = { url };
    ctx.body = this.decorateResponse(resData);
  }

}

CdnController.prefix = '/pub';

CdnController.action = {
  upload: {
    method: 'post'
  },
  generatePage: {
    method: 'post',
    schema: {
      images: {
        type: 'array',
        min: 1
      },
      template: {
        type: "string"
      }
    }
  }
};

module.exports = CdnController;
