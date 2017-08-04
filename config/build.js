const webpack = require("webpack");
const webpackProdConfig = require("./webpack.prod.config");

webpack(webpackProdConfig, (err, stats) => {
	if(err) {
		throw err;
	}
	console.log('  Build complete.\n');
    console.log('  Tip: built files are meant to be served over an HTTP server.\n' + 
    	'  Opening index.html over file:// won\'t work.\n'
    );
})