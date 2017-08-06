import "./less/banner.less";
import Banner from "./js/banner.js";
// 打包时请去掉这段
if(module.hot) {
	module.hot.accept();
}
// end

// default
const defaults = new Banner(".default", {
	// autoplay: false,
	// arrow: true,
	mousewheel: false,
	itemSpacing: 30
});
// fade-banner
const fade = new Banner(".fade-banner", {
	animation: "fade",
	mousewheel: false
});
// cube-banner
new Banner(".cube-banner", {
	animation: "cube",
	mousewheel: false
});
// vertical-banner
new Banner(".vertical-banner", {
	direction: "vertical",
	mousewheel: false
});