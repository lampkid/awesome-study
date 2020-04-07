class ResponseErrorDecorator {
  static baseDecorate(data, decoratorObj, merge) {
    return merge ? { ...data, ...decoratorObj } : { data, ...decoratorObj };
  }

  static ok(data, merge = false) {
    const errorInfo = { errno: 0, errmsg: 'success' };
    return ResponseErrorDecorator.baseDecorate(data, errorInfo, merge);
  }

  static notExist(data, merge = false) {
    const errorInfo = { errno: -404, errmsg: '数据不存在' };
    return ResponseErrorDecorator.baseDecorate(data, errorInfo, merge);
  }

  static decorate(data, merge = false) {
    if (data) {
      return ResponseErrorDecorator.ok(data, merge);
    } else {
      return ResponseErrorDecorator.notExist(data, merge);
    }
  }

  static decorateWithoutDataReturn(data, merge = false) {
    if (data) {
      return ResponseErrorDecorator.ok({}, merge);
    } else {
      return ResponseErrorDecorator.notExist(data, merge);
    }
  }
}

module.exports.ResponseErrorDecorator = ResponseErrorDecorator;
