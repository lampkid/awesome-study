'use strict';

const BaseController = require('../../lib/controller');

const FileService = require('./file.service');


class BannerController extends BaseController {
  constructor() {
    super();

    this.fileService = new FileService();
    console.log('demo');
  }

  async indexAction(ctx, next) {
    await ctx.render('index.html', {});
  }

  async uploadAction(ctx, next) {

    const filedata = ctx.request.files.file || ctx.request.files.filedata;

    //TODO: 临时文件什么时候删除
    const tmpFilepath = filedata.path;



    //TODO: 如果需要https资源

    const savedFilename = this.fileService.getFullFileName(filedata);

    // const filecontent = await this.fileService.readFile(tmpFilepath);
    // const uploadRet = await this.fileService.upload(savedFilename, filecontent); 

    const uploadRet = await this.fileService.uploadLocalFile(savedFilename, tmpFilepath); 


    ctx.body = this.decorateResponse(uploadRet)
  }

  async pageAction(ctx, next) {
    ctx.body = require('./banner.json');
  }

  async listAction(ctx, next) {

    const resData = {};
    ctx.body = this.decorateResponse(resData, true);
  } 
}

BannerController.prefix = '/manage';

BannerController.action = {
  list: {
    method: 'get',
    schema: {
      criteria: {
        type: "object",
        fields: {
          query: { type: "string" }
        }
      },
      page: { type: "integer", min: 1 }, 
      pageSize: { type: "integer", min: 1 }
    },
    schemaType: 'av'
  },

  upload: {
    method: 'post'
  }, 
};

module.exports = BannerController;
