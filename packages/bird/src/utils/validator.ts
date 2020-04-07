import schema from "async-validator";

export { schema };

// todo: rules interface
export function adaptFieldRules(field) {
  const { rules = [], label, type } = field;
  return rules.map(rule => {
    if (rule === "required") {
      const msgPrefix = type.indexOf("select") !== -1 ? "请选择" : "请输入";
      return { required: true, message: `${msgPrefix}${label}` };
    } else if (rule === "url") {
      return {
        type: "url",
        message: "请输入正确的URL"
      };
    } else if (rule === "number") {
      return {
        type: "number",
        message: "请输入数字"
      };
    } else if (rule === "email[]") {
      return {
        validator(rule, value, callback) {
          if (typeof value !== undefined && Array.isArray(value)) {
            if (value.every(item => /^.+@[\w\.]+$/.test(item))) {
              callback();
            } else {
              callback("必须为邮箱");
            }
          } else {
            callback();
          }
        }
      };
    }
    return rule;
  });
}

type TRule = {} | string;
export function isRequired(rules: TRule[] = []) {
  return rules.some(rule => rule === "required");
}

export function getFormRules(fieldList) {
  return fieldList.reduce((prevMap, field) => {
    const { key } = field;
    return { ...prevMap, [key]: adaptFieldRules(field) };
  }, {});
}

export function getFormErrorsByValidationResult({ errors, fields }) {
  return Object.keys(fields).reduce((errorMap, key) => {
    return {
      ...errorMap,
      [key]: fields[key].map(err => err.message)
    };
  }, {});
}

// rules: {
//   'key': [
//     'required'，
//     ''
//   ]
// }
export function validateByRules(rules, data) {
  const validator = new schema(rules);
  return validator.validate(data).catch(({ errors, fields }) => {
    return Promise.reject(getFormErrorsByValidationResult({ errors, fields }));
  });
}

export function getFieldFormat(field) {
  const { rules = [] } = field;
  const adapterRules = adaptFieldRules(field);

  return adapterRules.reduce((typeList, next) => {
    const { type } = next;
    if (type) {
      return [...typeList, type];
    }
    return typeList;
  }, []);
}

export function isFormat(field, format) {
  return getFieldFormat(field).includes(format);
}
