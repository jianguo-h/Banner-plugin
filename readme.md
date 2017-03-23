This is a slide plug-in, the mobile terminal and the PC side are applicable, can be compatible to IE8
If your project is based on jQuery, you can use the jquery.banner.min.js
However, based on jqeury, then your jQuery version should be under 2.0
The following configuration parameters, according to the needs to configure
{
	loop: true,							// whether loop play
	speed: 500,							// speed of movement
	arrow: false,						// Forward backward button
	startIndex: 0,						// start item
	interval: 3000,						// interval time
	itemSpacing: 0,						// item spacing between
 	keyboard: true,						// whether response keyboard event
	autoplay: true,						// whether autoplay
	pagination: true,					// whether show pagination
	mousewheel: true,					// whether mousewheel event
	animation: "slide",       			// cube, fade, default:slide
	direction: "horizontal",  			// "vertical", default:horizontal
	paginationClickable: true,			// page response to click event
	paginationClass: "",				// pages style
	paginationActiveClass: ""			// current page style
}