const config = { action: '/upload' };

function set(params) {
  Object.keys(params).forEach((key) => {
    config[key] = params[key];
  });
}

export { set };

export default config;
