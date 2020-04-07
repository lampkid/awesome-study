const path = require("path");

const doMock = require("api-mocker-middleware");

const MOCK = process.env.MOCK;

module.exports = {
  devServer: {
    host: "0.0.0.0",
    stats: "minimal",
    // stats:'errors-only',
    contentBase: path.join(__dirname, "../"),
    historyApiFallback: true,
    hot: true,
    inline: true,
    watchContentBase: true,
    before: function(app, server) {
      MOCK &&
        doMock(app, {
          path: path.resolve(__dirname, "../mock")
        });
    },
    proxy: {
      "/api": "http://196.18.34.22:3000"
    }
  }
};
