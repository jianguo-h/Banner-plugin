const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackDevConfig = require("./webpack.dev.config");
const port = 8080;
const url = 'http://localhost:' + port;

Object.keys(webpackDevConfig.entry).forEach(entryName => {
  webpackDevConfig.entry[entryName] = ['webpack-dev-server/client?' + url, 'webpack/hot/dev-server'].concat(webpackDevConfig.entry[entryName]);
});

const compiler = webpack(webpackDevConfig);
const server = new WebpackDevServer(compiler, {
  hot: true,
  stats: {
    colors: true
  }
});

server.listen(port, () => {
  console.log('> Listening at ' + url);
});