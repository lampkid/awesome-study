const fs = require('fs');
const csv = require('csv');
const iconv = require('iconv-lite');
module.exports.readCsv = function(filepath, columns = false) {
  const src = fs.createReadStream(filepath);
  src.setEncoding('utf-8');
  const csvRows = [];
  return new Promise((resolve, reject) => {
    src.pipe(csv.parse({ columns, skip_empty_lines: true, trim: true }))
      .on('data', function(csvrow) {
        if (Object.prototype.toString.call(csvrow) === '[object Object]') {
          if (!Object.keys(csvrow).every(key => csvrow[key] === '')) {
            // skip empty lines when columns is false
            csvRows.push(csvrow);
          }
        }
      })
      .on('end', function() {
        resolve(csvRows);
      })
      .on('error', function(err) {
        reject(new Error('请检查文件格式和内容是否正确'));
      });
  });
}

module.exports.readCsvStream = function(filepath) {
  const src = fs.createReadStream(filepath);
  return src.pipe(csv.parse())
}
