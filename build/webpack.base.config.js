const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: {
		app: './src/banner.js'
	},
	output: {
		filename: 'js/banner.min.js',
		path: path.resolve(__dirname, '../dist')
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: [
					path.resolve(__dirname, '../dist'),
					path.resolve(__dirname, '../node_modules'),
				],
				use: ['eslint-loader']
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10240
							// name: 'images/[name].[ext]'
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.json']
	},
	plugins: [
		// 移动html文件
		new HtmlWebpackPlugin({
			template: "./index.html",
			filename: "index.html",
			inject: true
		}),
	]
}