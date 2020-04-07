const path = require('path');
const { generateContent, htmlMinify, emitFile } = require('./core');



const globalConfig = {};

function getWorkDir() {
  const WORK_DIR = process.cwd();
  return WORK_DIR;
}

function getTemplatesDir() {
  return 'templates';
}



/*
 * generate page
 * @config:
 * {
 *  template: tplPath,
 *  data: {
 *    imgs: [
 *      '1.jpg',
 *      '2.jpg'
 *    ]
 *  },
 *  output: {
 *    filename: 'index.html',
 *    path: 'dist',
 *    publicPath: ''
 *  },
 *  cofigPath: '' // 自动生成，方便获取filename的默认目录
 * }
 */

/*
 * 由于node执行版本为10, 所以暂不对工具本身编译构建
 */

function formatConfig(config) {
  const { configPath = '.' } = config;
  const defaultPath = 'dist';
  const defaultFilename = path.join(path.dirname(configPath).replace(getWorkDir() + '/src/', ''), path.basename(configPath).replace(`.config${path.extname(configPath)}`, '.html'));
  console.log('defaultFilename', defaultFilename);
  const {
    template,
    output: { 
      filename = defaultFilename,
      path: filePath = defaultPath,
      publicPath = './'
    } = { 
      filename: defaultFilename,
      path: filePath = defaultPath,
      publicPath: './' }
  } = config;

  const tplAbsolutePath = path.resolve(getWorkDir(),
    getTemplatesDir(), `${template}`);

  const outputFullPath = path.resolve(getWorkDir(), filePath, filename);
  Object.assign(config, {
    template: tplAbsolutePath,
    output: {
      ...config.output,
      fullPath: outputFullPath
    }
  });

  return config;
}

async function generatePage(config) {
  config = { ...globalConfig, ...config }; // todo: recursive merge
  const formattedConfig = formatConfig(config);
  const { template, data, output: { publicPath, fullPath} } = formattedConfig;

  const html = await generateContent({ template, data, publicPath });
  const minifiedHtml = htmlMinify(html);
  await emitFile(minifiedHtml, fullPath);
}

async function generatePageFromConfigFile(configFile) {
  const config = require(configFile);
  Object.assign(config, { configPath: configFile });
  await generatePage(config);
}

module.exports.generatePage = generatePage;
module.exports.generatePageFromConfigFile = generatePageFromConfigFile;
module.exports.setConfig = function(config) {
  Object.assign(globalConfig, config);
}
