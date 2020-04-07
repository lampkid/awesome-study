const path = require('path');
module.exports = {
  //mode: 'production',
  mode: 'development',
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve('./my_loader.js'),
            options: {
            }
          }
        ]

      }
    ]
  },
  devtool: 'source-map'
};
