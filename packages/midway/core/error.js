const { UniqueConstraintError, AuthError, ValidateError } = require('./errors');
/*
 * Unkown error
 * DB error
 * NotExist error
 */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    
    if (err instanceof UniqueConstraintError) {
      ctx.status = 200;
      ctx.body = {
        errmsg: `唯一标识重复: ` +  err.errors.map(errItem => errItem.value.split('-')[0]),
        errno: -2,
      };
      return;
    } else if (err instanceof AuthError || err instanceof ValidateError) {
      ctx.body = err.toObject();
    } else {
      ctx.body = {
        errmsg: err && err.message,
        errno: -1
      }
    }
    
    ctx.app.emit('error', err, ctx);
  }
};
