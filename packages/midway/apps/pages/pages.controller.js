'use strict';

const PagesService = require('./pages.service.js');

const BaseController = require('../../lib/controller');

class PagesController extends BaseController {
  constructor() {
    super();
    this.pagesService = new PagesService();
  }

  async listAction(ctx, next) {

    const { criteria: { query } = {}, page, pageSize } = ctx.request.body;

    const params = {
      page,
      pageSize,
      query  
    };

    const resData =  await this.pagesService.listByPage(params); 
    ctx.body = this.decorateResponse(resData, true);
  }

  // TODO: isEmpty/isSet函数
  async getAction(ctx, next) {
    const { id, key } = ctx.query;
    let resData = {};
    if (id) {
      resData = await this.pagesService.getByField('id', id)
    } else if (key) {
      resData = await this.pagesService.getByField('name', key)
    }
    ctx.body = this.decorateResponse(resData); 
  }

  async saveAction(ctx, next) {
    const item = this.fetchParams(['id', 'name', 'title', 'description', 'template', 'url']);
    const resData = await this.pagesService.save(item);
    ctx.body = this.decorateResponse(resData);
  }

  async removeAction(ctx, next) {
    const { id, key } = this.fetchParams(['id', 'key']);
    let resData = {};

    if (id) {
      resData = await this.pagesService.removeByField('id', id); 
    } else if (key) {
      resData = await this.pagesService.removeByField('name', id); 
    }

    ctx.body = this.decorateResponse(resData);
  }
}

PagesController.prefix = '/manage';

PagesController.action = {
  list: {
    method: 'post',
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
  get: {
    method: 'get',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              minimum: 1,
              title: 'ID'
            }
          },
          required: [ 'id' ]
        },
        {
          type: 'object',
          properties: {
            key: {
              type: 'number',
              title: '唯一标识'
            }
          },
          required: [ 'key' ]
        }
      ]
    },
    schemaType: 'ajv'
  },
  remove: {
    method: 'post',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              minimum: 1,
              title: 'ID'
            }
          },
          required: [ 'id' ]
        },
        {
          type: 'object',
          properties: {
            key: {
              type: 'number',
              title: '唯一标识'
            }
          },
          required: [ 'key' ]
        }
      ]
    },
    schemaType: 'ajv'
  },
  save: {
    method: 'post',
    schema: {
      type: "object",
      properties: {
        id: {
          type: 'integer',
          minimum: 1,	
          title: 'ID',
          errorMessage: '必须大于1',
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
          title: '页面标识',
          errorMessage: '1到100个字符之间'
        },
        url: {
          type: 'string',
        },
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
          title: '页面标题',
          errorMessage: '1到100个字符之间'
        },
        template: {
          type: 'object',
        },
        description: {
          type: 'string'
        }
      },
      additionalProperties: false,
      anyOf: [
        {
          required: ['id'],
          minProperties: 2,
        },
        {
          required:['name', 'title', 'description', 'template']
        }
      ]
      /*
      errorMessage: {
        properties: {
          id: '最小值为2'
        }
      }
      */
    },
    schemaType: 'ajv'
  }
};

module.exports = PagesController;
