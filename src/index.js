import Banner from "./js/banner.es6.js";
// 打包时请去掉这段
if(module.hot) {
	module.hot.accept();
}
// end

new Banner(".banner", {
	
});