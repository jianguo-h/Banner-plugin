const path = require("path");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const webpackDevConfig = require("./webpack.dev.config");
const compiler = webpack(webpackDevConfig);
const port = 8080;

// http://webpack.github.io/docs/webpack-dev-server.html
Object.keys(webpackDevConfig.entry).forEach(filename => {
	webpackDevConfig.entry[filename].unshift("webpack-dev-server/client?http://localhost:"+ port +"/", "webpack/hot/dev-server");
});

const server = new webpackDevServer(compiler, {
	// quiet: true,
	hot: true,
	disableHostCheck: true,		// 允许使用ip访问
	// publicPath: webpackDevConfig.output.publicPath,
    stats: {
        colors: true
    }
});

server.listen(8080, () => {
	console.log('> Listening at http://localhost:' + port + '\n');
});