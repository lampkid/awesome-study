const { ResponseErrorDecorator } = require('../utils');

class Controller {
  constructor() {
  }

  async _init(ctx, next) {
    this.requestMethod = ctx.request.method;
    this._params = {};
    this._params.GET = JSON.parse(JSON.stringify(ctx.query));
    if (this.requestMethod != 'GET') {
      this._params[this.requestMethod] = ctx.request.body;
    }
    this.ctx = ctx;
    if (typeof this.init === 'function') {
      if (await this.init(ctx, next) === false) {
        return;
      };
    }
    await next();
  }

  fetchParams(keyList = 'all', method) {
    const params = this._params[method || this.requestMethod];
    if (keyList === 'all') {
      return { ...params };
    }
    const values = {};
    keyList.forEach((key) => {
      if (params[key] !== undefined) {
        values[key] = params[key];
      }
    });
    return values;
  }

  getParam(param) {
    return this._params.GET[param];
  }

  fetchFile() {
    const filedata = this.ctx.request.files.file;
    console.log(this.ctx.request.files);
    return filedata;
  }

  decorateResponse(...args) {
    return ResponseErrorDecorator.decorate(...args);
  }

  decorateResponseWithoutDataReturan(...args) {
    return ResponseErrorDecorator.decorateWithoutDataReturn(...args);
  }
}

module.exports = Controller;
