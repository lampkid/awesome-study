'use strict';

const BaseController = require('../../lib/controller');

class IndexController extends BaseController {
  constructor() {
    super();
  }

  async indexAction(ctx, next) {
    await ctx.render('index.html', {});
  }

  async listAction(ctx, next) {

    const resData = {};
    ctx.body = this.decorateResponse(resData, true);
  }
}

IndexController.prefix = '/manage';

IndexController.action = {
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
};

module.exports = IndexController;
