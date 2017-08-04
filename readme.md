# Calendar #

> 一款移动端的时间选择插件

## Build Setup ##

#### 1.install dependencies ####
npm install（npm i）

#### 2.serve with hot reload at localhost:8080 ####
npm run start

#### build for production with minification ####
npm run build

## 简介 ##
### opts参数 ###
<pre><code>
{
	// 作用于的元素节点, 同css选择器, eg: "#calendar", ".calendar"
	el: "",
	// 设置的日期格式, 默认"yyyy-MM-dd", 可选"yyyy-MM", "yyyy"								
	format: "yyyy-MM-dd",	
	// 年数的范围, 默认100, 最小为3			
	range: 100,	
	// 是否只读(只有当节点为input时有效)，默认为true							
	readonly: true,		
	// 取消的回调函数, 默认为null，设置后可在点击取消时先执行自定义的回调，再隐藏				
	cancelCb: null,				
	// 确定的回调函数, 默认为null，设置后可在点击确定时先执行自定义的回调，才隐藏		
	confirmCb: null						
}
</pre></code>
### 调用方式 ###
es6 环境下使用如下方式，但是要注意**引入的路径**根据您自己的项目目录进行调整
<pre><code>
import "./less/calendar.less";
import Calendar from "./js/calendar";
new Calendar ({
	el: "#calendar"				
})
</code></pre>
### webpack配置 ###
首次用 es6 写的插件，不会 es6 的童鞋赶紧偷偷的去看看吧，这里推荐阮一峰老师的[es6入门教程](http://es6.ruanyifeng.com/)，webpack的配置也是自己一步一步配过来的，踩了很多坑，不过还好最终还是成功了，这里简单的说下热更新，我是以node.js API的方式进行配置的（config / dev-server.js中），其实[官方文档](https://doc.webpack-china.org/guides/hot-module-replacement/)已经说得很清楚了，主要的几个点如下：
1. 在 webpack.config.js 的entry选项中添加：webpack/hot/dev-server
2. 在 webpack.config.js 的plugins选项中添加：new webpack.HotModuleReplacementPlugin()
3. 在 webpack-dev-server 的配置中添加：hot: true
4. 在路口文件的开头处加上以下代码
##### *1. 路口文件的开头处加* #####
<pre><code>
if(module.hot) {
	module.hot.accept();
}
</code></pre>
##### *2. dev-server.js中加上以上1,3两点* #####
<pre><code>
var config = require("./webpack.config.js");
Object.keys(webpackDevConfig.entry).forEach(filename => {
	webpackDevConfig.entry[filename].unshift("webpack-dev-server/client?http://localhost:"+ port +"/", "webpack/hot/dev-server");
});
var compiler = webpack(config);
const server = new webpackDevServer(compiler, {
	hot: true,
	...
});
</code></pre>
##### *3. webpack.config.js中plugins选项中添加* #####
<pre><code>
plugins: [
		new webpack.HotModuleReplacementPlugin()
]
</code></pre>
### 问题 ###
虽然这里还存在几个问题待解决，但是通过 es6 的方式引入还是可以的
1. 热更新对 html 文件的更改无效
2. 打包之后的代码使用 commonJS 的方式引入失效