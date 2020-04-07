/*
 * core
 */
const _ = require('lodash');
const pathlib =require('path');
const fs = require('./file');

const minify = require('html-minifier').minify;

/*
 * @templatePath: 模板路径
 */
async function getTemplateString(templatePath) {
  const tplString = await fs.readFile(templatePath)
  return tplString;
}


function compile(tplString, data) {
  const compiled = compileTpl(tplString);
  return compiled(data);
}

function compileTpl(tplString) {
  try {
    return _.template(tplString);
  } catch(e) {
    console.log('compile tpl err:', e);
  }
}


function htmlMinify(html) {
  return minify(html, {
    removeComments: true,
    preserveLineBreaks: false,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  });
}

async function generateContent(config) {
  const { template, data, publicPath } = config; 

  const tplStr = await getTemplateString(template);
  const html = compile(tplStr, { data, publicPath }); // publicPath先使用模板传递方式解决! dom解析？
  return html;
}

async function emitFile(html, outputFile) {
  const outputDir = pathlib.dirname(outputFile);
  await fs.mkdirp(outputDir);
  await fs.writeFile(outputFile, html, { encoding: 'utf8' });
}

module.exports = {
  generateContent,
  htmlMinify,
  emitFile
}


