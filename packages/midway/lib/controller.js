const Controller = require('../core/controller');
const { AuthError } = require('../core/errors');
const env = require('../env');

const Config = require('../core/config');

const ral = require('../core/ral');
const ralP = ral.ralP;


const defaultUser = {
  username: 'xxx'
};

class BaseController extends Controller {

  constructor() {
    super();
    this.auths = {};
  }

  async checkLogin(ctx) {
    let userInfo = {};
    const ticket = ctx.cookies.get('ticket');
    if (env === 'production' && !ticket) {
      throw new Error('not login, no ticket');
    }
    if (env === 'production' && errno !== 0) {
      throw new Error('not login' + errmsg);
    }
    if (env !== 'production') {
      userInfo = defaultUser; // for debug
    }
    return userInfo;
  }

  async init(ctx, next) { 
    const userInfo = await this.checkLogin(ctx);
    const { username: user_id } = userInfo;
    this.auths.user_id = user_id;
    
    if (!this.auths.user_id) {
      throw new Error('auth error');
    }
  }

  async auth(projectId) {
    const { user_id } = this.auths;
    const hasAuth = true;
    if (!hasAuth) {
      throw new AuthError('auth error');
    }
  }
}

module.exports = BaseController;
