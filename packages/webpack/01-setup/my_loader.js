const getOptions =  require('loader-utils').getOptions;
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

module.exports = function(source) {
  debugger
  const options = getOptions(this);

  validateOptions(schema, options, 'Example Loader');

  // Apply some transformations to the source...

  // return source;
  return `/* source code */ \n${ source }`;
}
