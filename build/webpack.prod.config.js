const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpackBaseConfig = require("./webpack.base.config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpackProdConfig = webpackMerge(webpackBaseConfig, {
  devtool: false,
  mode: 'production',
  output: {
    publicPath: "./"
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "postcss-loader",
            "less-loader"
          ]
        })
      }
    ]
  },
  plugins: [
    // 提取css
    new ExtractTextPlugin({
      filename: "css/banner.min.css"
    }),
    // 压缩混淆js
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require'],
      sourceMap: true
    }),
    // 压缩css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true
    }),
    // 拷贝静态文件
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "../static"),
      to: path.resolve(__dirname, "../dist/static"),
      ignore: ['.*']
    }])
  ]
});

module.exports = webpackProdConfig;