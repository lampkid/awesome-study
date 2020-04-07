const Controller = require('../core/controller');
const env = require('../env');

class BaseController extends Controller {

  constructor() {
    super();
  }

  async init(ctx, next) { 
    const token = this.getParam('access_token'); // MISPj接入
    
    if (!this.isTokenValid(token)) {
      throw new Error('token error');
    }
  }

  isTokenValid(token) {
    /*
     * app_id 12345
     * app_key 48rf999fefk23ia
     */

    // 暂且通过vip都可以访问
    return true;
    /*
    if (env !== "production") {
      return true;
    }
    return token === 'xxx'; 
    */
  }
}

module.exports = BaseController;
