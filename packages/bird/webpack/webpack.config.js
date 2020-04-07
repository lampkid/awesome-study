const path = require("path");
const webpack = require("webpack");
const env = process.env.NODE_ENV;

const isPre = env === "pre";
const isProductionMode = env === "production";

const outputPath = isPre
  ? path.resolve(__dirname, "../dist/pre")
  : path.resolve(__dirname, "../dist");
const manifestPublicPath = "/";

const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// ts 里使用antd
const tsImportPluginFactory = require("ts-import-plugin");

const ManifestPlugin = require("webpack-manifest-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyWebpackPlugin = require('copy-webpack-plugin')

const modeMap = {
  development: "development",
  production: "production"
};
const config = {
  mode: modeMap[env] || "production",
  entry: "./src/index.tsx",
  devtool: "source-map",
  output: {
    path: outputPath,
    chunkFilename: "[name].[chunkhash:8].js",
    filename: "[name].[hash:8].js"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".png"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@componnets": path.resolve(__dirname, "../src/componnets")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "antd",
                libraryDirectory: "lib",
                style: true
              })
            ]
          })
        },
        exclude: /node_modules/
      },
      {
        test: /\.less|css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          {
            loader: "less-loader",
            options: {
              // https://github.com/ant-design/ant-design/issues/7927#issuecomment-372513256
              javascriptEnabled: true // Less3
            }
          }
        ]
      },
      {
        test: /\.png$/,
        use: ["file-loader"]
      },
      {
        test: /\.svg$/,
        loader: "raw-loader"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[id].[contenthash:8].css"
    }),
    new ManifestPlugin({
      publicPath: manifestPublicPath
    }),
    new HtmlWebpackPlugin({
      // Also generate a test.html
      filename: "index.html",
      template: path.resolve(__dirname, "../template/index.html")
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: "-"
    }
  }
};

const devServerConfig = require("./devServer.config.js");

module.exports = isProductionMode ? config : merge(config, devServerConfig);
