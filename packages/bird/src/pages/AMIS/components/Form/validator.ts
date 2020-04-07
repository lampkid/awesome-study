const validateUrl = (rule, value, callback) => {
  // 输入为空时 取消校验
  if (value === undefined || value === '') {
    return callback();
  }

  if (value.trim && value.trim() === '') {
    return callback('error');
  }

  const urlPattern = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
  const isValid = value.match(urlPattern);
  if (isValid) {
    return callback();
  }

  return callback('error');
};

const RULE = {
  required: { required: true, message: '必填' },
  url: {
    validator: validateUrl,
    message: '请输入以http://或https://开始的有效URL',
  },
};

export function registerRules(newRules) {
  Object.assign(RULE, newRules);
}

export function transformRules(rules) {
  return rules.filter(rule => !!rule).map(rule => {
    if (typeof rule === 'string' && !RULE[rule]) {
      console.warn(`${rule} not registerd`);
    }
    return typeof rule === 'string' ? RULE[rule] : rule;
  });
}

export default RULE;
