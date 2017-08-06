# Banner #

>  一款同时兼容移动端和PC端的幻灯片插件

## Build Setup ##

> #### 1.install dependencies ####
npm install（npm i）

> #### 2.serve with hot reload at localhost:8080 ####
npm run start

> #### build for production with minification ####
npm run build

## 简介 ##
### 插件说明 ###
		一款有着常见功能的幻灯片插件，应该能满足当前web开发中的常见需求，同时适用PC端和移动端(*请在chrome浏览器下的手机模式查看*)，兼容到 ie10，当然如果你要兼容到更低版本的 ie，那我只能说“不好意思，祝您好运O(∩_∩)O“。主要有滑动，淡入，3d旋转3种效果，具体的可根据需求去配置参数，但是html的结构需按如下方式：
	<div class="banner">
		<div class="banner-wrapper">
			<div class="banner-item">items 1</div>
			<div class="banner-item">items 2</div>
			<div class="banner-item">items 3</div>
			<div class="banner-item">items 4</div>
			<div class="banner-item">items 5</div>
			<div class="banner-item">items 6</div>
		</div>
	</div>
		以上各个层次的div的class需要有，当然你也可以添加额外的class，比如最外层的div添加default，然后可以按下面的方式调用（见下方的"调用方式"）

### opts参数说明 ###
<pre><code>
{
	loop: true,							// 是否循环播放，默认true
	speed: 500,							// 运动的速度，默认500
	arrow: false,						// 是否显示前进后退按钮，默认false
	startIndex: 0,						// 起始的item，默认为0（即第一张）
	interval: 3000,						// 间隔时间，默认3000
	itemSpacing: 0,					   	// item之间的间距，默认0
	keyboard: true,						// 是否响应键盘事件，默认true
	autoplay: true,						// 是否自动播放，默认true
	pagination: true,					// 是否显示分页，默认true
	mousewheel: true,					// 是否响应鼠标滚轮事件，默认true
	animation: "slide",       			// 动画效果cube, fade, 默认slide
	direction: "horizontal", 			// 运动的方向vertical, 默认horizontal
	paginationClickable: true,	   		// 分页是否响应点击事件，默认true，false时可禁用分页按钮的的点击事件
	paginationClass: "",		        // 分页的样式，默认为空，可添加自己的分页样式类名
	paginationActiveClass: ""			// 当前分页的样式，默认为空
}
</pre></code>

### 调用方式 ###
es6 环境下使用如下方式，但是要注意**引入的路径**根据您自己的项目目录进行调整
<pre><code>
import "./less/banner.less";
import Banner from "./js/banner.es6.js";
new Banner(".default", {
	autoplay: false,
	mousewheel: false
})
</code></pre>