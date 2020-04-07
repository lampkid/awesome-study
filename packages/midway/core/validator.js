const av = require('async-validator');
const Ajv = require('ajv');
const ajv = Ajv({ allErrors: true, jsonPointers: true, verbose: true, coerceTypes: true });
const ajvStrict = Ajv({ allErrors: true, jsonPointers: true, verbose: true });
require('ajv-errors')(ajv);
require('ajv-errors')(ajvStrict);
const localize  = require('ajv-i18n');
const schemaCache = {};
const messages = require('./messages'); // av error 自定义

const { ValidateError } = require('./errors');

function validateByAvPromise(validator, data) {
  // TODO: transform string /\d+/ to integer if the type is integer
  return new Promise((resolve, reject) => {
    let dataParsed = {};
    try {
      dataParsed = JSON.parse(JSON.stringify(data))
    } catch(err) {
      console.warn('json format err', data);
    }
    validator.validate(dataParsed, { messages }, (errors) => {
      resolve(errors);
    })
  });
}

function errorsText(errors) {
  if (!errors) {
    return '';
  }
  return errors.map((error) => {
    const { parentSchema: { title = '' } = {}, message } = error;
    return `${title}${message}`;
  }).join(',');
}

function getValidator(schemaName) {
  if (!schemaCache[schemaName]) {
    return;
  }

  const { [schemaName]: { schemaType, validator } } = schemaCache;

  if (schemaType === 'ajv') {
    return { validate: ajv.getSchema(schemaName) };
  } else if (schemaType ==='ajv-strict') {
    return { validate: ajvStrict.getSchema(schemaName) };
  } else {
    return validator;
  }
}

function getValidatorType(schemaName) {
  const { [schemaName]: { schemaType, validator } } = schemaCache;
  return schemaType;
}

async function validate (schemaName, data) {
  const validator = getValidator(schemaName);
  if (!validator) {
    return;
  }

  const schemaType = getValidatorType(schemaName);

  if (schemaType === 'ajv' || schemaType === 'ajv-strict') {
    const valid = validator.validate(data);
    localize.zh(validator.validate.errors);
    if (validator.validate.errors) {
      //return ajv.errorsText(validator.validate.errors, { dataVar: 'data' });
      //return validator.validate.errors;
      return errorsText(validator.validate.errors);
    }
  } else {
    return await validateByAvPromise(validator, data);
  }
}

exports.validateRoute = function(schemaName, schemaType) {
	// TODO: support query string when post/put/delete
  return async (ctx, next) => {
		const methodDataMap = {
			GET: JSON.parse(JSON.stringify(ctx.query)),
			POST: ctx.request.body,
		};

		const data = methodDataMap[ctx.request.method] || ctx.request.body || {};
    const errors = await validate(schemaName, data);
    if (errors)  {
      throw new ValidateError(errors);
    }
    if (ctx.request.method === 'GET') {
      ctx.query = data;
    } else {
      ctx.request.body = data;
    }
    await next();
  }
}

exports.installSchema = function (schema, schemaType, schemaName) {
  if (!schema) {
    return;
  }
  schemaCache[schemaName] = {
    schemaType,
  };
  if (schemaType === 'ajv') {
    ajv.addSchema(schema, schemaName);
  } else if (schemaType === 'ajv-strict') {
    ajvStrict.addSchema(schema, schemaName);
  } else {
    schemaCache[schemaName].validator = new av(schema);
  }
}

exports.getValidator = getValidator;

exports.validate = validate;

exports.validateCore = function(schema, data, schemaType = 'ajv') {
  if (schemaType === 'ajv') {
    const validateFunc = ajvStrict.compile(schema);
    const valid = validateFunc(data);
    localize.zh(validateFunc.errors);
    return {
      valid: valid,
      errors: validateFunc.errors
    }
  }
}
exports.errorsText = errorsText;
exports.errorsTextAjv = ajv.errorsText;
exports.errorsArray = function (errors, options) {
  let errorsConverted = ajv.errorsText(errors, { separator: '|', ...options })
  if (typeof errorsConverted === 'string') {
    errorsConverted = errorsConverted.split('|');
  }
  return errorsConverted;
}
