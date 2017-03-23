;(function($) {
	"use strict";
	Array.prototype.indexOf = function(prop) {
		for(var i in this) {
			if(prop === this[i]) {
				return i;
			}
		}
		return -1;
	}
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, ''); 
	}
	var Banner = function(ele, opts) {
		this.opts = $.extend({}, $.fn.Banner.defaults, opts);
		this.$ele = $(ele);
		this.init();
	}
	Banner.prototype = {
		// 初始化
		init: function() {
			var self = this,
				loop = (typeof self.opts.loop === "boolean") ? self.opts.loop : true,
				arrow = (typeof self.opts.arrow === "boolean") ? self.opts.arrow : true,
				autoplay = (typeof self.opts.autoplay === "boolean") ? self.opts.autoplay : true,
				pagination = (typeof self.opts.pagination === "boolean") ? self.opts.pagination : true,
				startIndex = (typeof self.opts.startIndex === "number") ? parseInt(self.opts.startIndex) : 0,
				speed = (typeof self.opts.speed === "number" && self.opts.speed > 0) ? parseInt(self.opts.speed) : 500,
				itemSpacing = (typeof self.opts.itemSpacing === "number" && self.opts.itemSpacing > 0) ? parseInt(self.opts.itemSpacing) : 0;

			// init config opts
			self.loop = loop;
			self.speed = speed;
			self.animated = false;
			self.itemSpacing = itemSpacing;
			self.ieVersion = self.getIeVersion();
			self.isFlex = self.isSupportFlex();
			self.animation = self.getAnimation();
			self.bannerWrapper = self.$ele.find(".banner-wrapper");
			self.items = self.bannerWrapper.find(".banner-item");
			self.isHorizontal = self.opts.direction === "vertical" ? false : true;
			self.eventType = (self.judgePlatform() === "pc") ? "click" : "touchstart";
			self.curIndex = (startIndex > 0 && startIndex < self.getItemsLength()) ? startIndex : 0;
			self.itemSize = self.isHorizontal ? self.items.eq(0).outerWidth() : self.items.eq(0).outerHeight();

			if(!self.isFlex) {
				var bannerSize = self.items.eq(0).outerHeight();
				self.$ele.addClass("banner-no-flexbox").css("height", bannerSize + "px");
			}
			if(loop) {
				self.createLoop();
			}
			if(self.opts.animation === "cube" && (!self.isFlex || self.ieVersion !== undefined)) {
				alert("您的浏览器暂不支持3D动画，请使用最新版的chrome浏览器！")
			}
			if(self.animation === "fade") {
				self.fade();
			}
			else if(self.animation === "cube") {
				self.cube();
			}
			else {
				self.slide();
			}
			if(pagination) {
				self.pagination();
			}
			if(arrow) {
				self.arrow();
			}
			if(autoplay) {
				self.autoplay();
			}
			if(self.itemSpacing && self.animation === "slide") {
				self.setItemSpace(self.itemSpacing);
			}
			if(!self.isHorizontal) {
				self.vertical();
			}
			if(self.curIndex) {
				self.isSetStart = true;
				self.play(self.curIndex);
			}
			self.initEvent();
		},
		// 循环
		createLoop: function() {
			var self = this,
				firstItem = self.items.eq(0).clone(true),
				lastItem = self.items.eq(self.items.length - 1).clone(true);

			self.bannerWrapper.append(firstItem).prepend(lastItem);
			self.items = self.bannerWrapper.find(".banner-item");
			self.updateWrapper();
		},
		// 更新item
		updateWrapper: function() {
			var self = this,
				itemSize = self.itemSize,
				curIndex = self.curIndex + 1,
				itemSpacing = self.itemSpacing;

			if(self.animation === "slide") {
				if(self.isFlex) {
					self.bannerWrapper.css("transitionDuration", "0ms");
					if(self.isHorizontal) {
						self.bannerWrapper.css("transform", "translate3d(-" + (itemSize + itemSpacing) * curIndex + "px, 0, 0)");		
					}
					else {
						self.bannerWrapper.css("transform", "translate3d(0, -" + (itemSize + itemSpacing) * curIndex + "px, 0)");
					}
				}
				else {
					if(self.isHorizontal) {
						self.bannerWrapper.css("left", -(itemSize + itemSpacing) * curIndex + "px");		
					}
					else {
						self.bannerWrapper.css("top", -(itemSize + itemSpacing) * curIndex + "px");
					}
				}
			}
		},
		// 设置间距
		setItemSpace: function(itemSpacing) {
			var self = this,
				itemsLen = self.getItemsLength();

			for(var i = 0; i < itemsLen; i++) {	
				if(self.isHorizontal) {
					self.isFlex && self.items.eq(i).css("marginRight", itemSpacing + "px");	
				}
				else {
					self.items.eq(i).css("marginBottom", itemSpacing + "px");
				}
			}
		},
		// 设置竖屏
		vertical: function() {
			var	itemSize = this.itemSize;

			this.$ele.addClass("banner-vertical");
			this.bannerWrapper.css("height", itemSize +"px");
		},
		// 3D立方体效果
		cube: function() {
			var	self = this,
				items = self.items,
				itemSize = self.itemSize,
				itemsLen = self.getItemsLength(),
				isHorizontal = self.isHorizontal,
				bannerWrapper = self.bannerWrapper,
				rotateOffset = self.loop ? 90 : 0,
				curIndex = self.loop ? self.curIndex + 1 : self.curIndex;

			for(var i = 0; i < itemsLen; i++) {
				var rotateAngle = i * 90,
					round = Math.floor(i / 4);
				if(isHorizontal) {
					if(i % 4 === 0) {
						items.eq(i).css("transform", "rotateY("+ rotateAngle +"deg) translate3d("+ (-round * 4 * itemSize) +"px, 0, 0)");
					}
					else if(i % 4 === 1) {
						items.eq(i).css("transform", "rotateY("+ rotateAngle +"deg) translate3d(0, 0, "+ (-round * 4 * itemSize) +"px)");
					}
					else if(i % 4 === 2) {
						items.eq(i).css("transform", "rotateY("+ rotateAngle +"deg) translate3d("+ (itemSize + round * 4 * itemSize) +"px, 0, "+ itemSize +"px)");
					}
					else if(i % 4 === 3) {
						items.eq(i).css("transform", "rotateY("+ rotateAngle +"deg) translate3d("+ (-itemSize)+"px, 0, "+ (3 * itemSize + itemSize * 4 * round) +"px)");
					}
				}
				else {
					if(i % 4 === 0) {
						items.eq(i).css("transform", "rotateX("+ -rotateAngle +"deg) translate3d(0, "+ (-round * 4 * itemSize) +"px, 0)");
					}
					else if(i % 4 === 1) {
						items.eq(i).css("transform", "rotateX("+ -rotateAngle +"deg) translate3d(0, 0, "+ (-round * 4 * itemSize) +"px)");
					}
					else if(i % 4 === 2) {
						items.eq(i).css("transform", "rotateX("+ -rotateAngle +"deg) translate3d(0, "+ (itemSize + round * 4 * itemSize) +"px, "+ itemSize +"px)");
					}
					else if(i % 4 === 3) {
						items.eq(i).css("transform", "rotateX("+ -rotateAngle +"deg) translate3d(0, "+ (-itemSize)+"px, "+ (3 * itemSize + itemSize * 4 * round) +"px)");
					}
				}
			}
			self.$ele.addClass("banner-cube");
			items.eq(curIndex).css("visibility", "visible")
			bannerWrapper.css("transformOrigin", "50% 50% "+ -(itemSize / 2) +"px");
			self.loop && bannerWrapper.css("transitionDuration", "0ms");
			!isHorizontal && bannerWrapper.css("transform", "rotateX("+ rotateOffset +"deg)");
			isHorizontal && bannerWrapper.css("transform", "rotateY(-"+ rotateOffset +"deg)");
		},
		// 淡入淡出效果
		fade: function() {
			var self = this,
				items = self.items,
				itemsLen = self.getItemsLength(),
				curIndex = self.loop ? self.curIndex + 1 : self.curIndex;

			for(var i = 0; i < itemsLen; i++) {
				if(self.isFlex) {
					items.eq(i).css({
						"transitionDuration": "0ms",
						"opacity": 0
					});
					(self.ieVersion <= 8) && items.eq(i).css("filter", "alpha(opacity=0)");
					if(self.isHorizontal) {	
						items.eq(i).css("transform", "translate3d(-" + self.itemSize  * i + "px, 0, 0)");
					}
					else {
						items.eq(i).css("transform", "translate3d(0, -" + self.itemSize  * i + "px, 0)");	
					}
				}
				else {
					items.eq(i).css({
						"position": "absolute",
						"top": 0,
						"opacity": 0
					});
					(self.ieVersion <= 8) && items.eq(i).css("filter", "alpha(opacity=0)");
				}
			}
			self.$ele.addClass("banner-fade");
			items.eq(curIndex).css("opacity", 1);	
			(self.ieVersion <= 8) && items.eq(curIndex).css("filter", "alpha(opacity=100)");
		},
		// 滑动效果
		slide: function() {
			var self = this,
				itemsLen = self.getItemsLength();

			if(self.isFlex) return;
			else {
				if(self.isHorizontal) {
					!self.loop && self.bannerWrapper.css("left", 0);
					for(var i = 0; i < itemsLen; i++) {
						var left = (i === 0 ) ? self.itemSize * i : (self.itemSize + self.itemSpacing) * i;
						self.items.eq(i).css({
							"position": "absolute",
							"left": left + "px"
						});
					}
				}
				else {
					!self.loop && self.bannerWrapper.css("top", 0);
				}
			}
		},
		// 绑定滑动事件
		swiperEvent: function() {
			var self = this;
			self.isMove = false;

			if(self.judgePlatform() === "pc") {
				self.bannerWrapper.on("mousedown", function(e) {
					self.isMove = true;
					self.onTouchstart(e);
				});
				$(document).on("mousemove", function(e) {
					self.isMove && self.onTouchmove(e);
					if(self.timer) {
						self.isMove && clearInterval(self.timer);
					}
				}).on("mouseup", function(e) {
					self.isMove = false;
					self.onTouchEnd(e);
				});
			}
			else {
				self.bannerWrapper.on("touchstart", function(e) {
					self.isMove = true;
					self.onTouchstart(e);
				}).on("touchmove", function(e) {
					self.isMove && self.onTouchmove(e);
				}).on("touchend", function(e) {
					self.isMove = false;
					self.onTouchEnd(e);
				});
			}
		},
		// 判断滑动方向
		swiperDirection: function() {
			var self = this,
				angle = self.angle,
				boundary = (self.offsetTime > 500) ? parseInt(self.itemSize / 2) : 50; 

			var swiperHorizontal = function(boundary) {
				// left or ←
				// debugger;
				console.log(self.isMove);
				if(self.offset >= boundary && (angle >= -45 && angle < 45)) {
					self.prev();
				}
				// right or →
				else if(self.offset < -boundary && (angle >= 135 && angle <= 180 || angle >= -180 && angle < -135)) {
					self.next();
				}
				else if(self.offset !== undefined && self.offset !== 0) {
					if((angle >= -45 && angle < 45) || (angle >= 135 && angle <= 180 || angle >= -180 && angle < -135)) {
						!self.animated && self.play(self.curIndex);
					}
				}
			}
			var swiperVertical = function(boundary) {
				// top or ↑
				if(self.offset >= boundary && (angle >= 45 && angle < 135)) {
					self.prev();
				}
				// down or ↓
				else if(self.offset < -boundary && (angle >= -135 && angle < -45)) {
					self.next();
				}
				else if(self.offset !== 0) {
					if((angle >= 45 && angle < 135) || (angle >= -135 && angle < -45)) {
						!self.animated && self.play(self.curIndex);
					}
				}
			}
			if(self.isHorizontal) {
				swiperHorizontal(boundary);
			}
			else {
				swiperVertical(boundary);
			}
		},
		// 阻止默认, 防止冒泡
		stopPrevent: function(e) {
			if(e.stopPropagation) {
				e.stopPropagation();
				e.preventDefault();
			}
			else {		
				e.cancelBubble = true;
				e.returnValue = false;
			}
		},
		// 绑定touchstart
		onTouchstart: function(e) {
			e = e || window.event;
			this.stopPrevent(e);
			this.startTime = new Date().getTime();
			this.startX = e.type === "touchstart" ? e.originalEvent.targetTouches[0].pageX : (e.pageX || e.clientX);
			this.startY = e.type === "touchstart" ? e.originalEvent.targetTouches[0].pageY : (e.pageY || e.clientY);
		},
		// 绑定touchmove
		onTouchmove: function(e) {
			e = e || window.event;
			var self = this,
				itemSize = self.itemSize,
				curIndex = self.curIndex,
				itemSpacing = self.itemSpacing,
				bannerWrapper = self.bannerWrapper,
				endX = e.type === "touchmove" ? e.originalEvent.targetTouches[0].pageX : (e.pageX || e.clientX),
				endY = e.type === "touchmove" ? e.originalEvent.targetTouches[0].pageY : (e.pageY || e.clientY),
				translateOffset = (self.loop === true) ? -(itemSize + itemSpacing) : 0;

			self.stopPrevent(e);
			self.dx = endX - self.startX;
			self.dy = endY - self.startY;
			self.offset = self.isHorizontal ? self.dx : self.dy;
			self.angle = parseInt(Math.atan2(self.dy, self.dx) * 180 / Math.PI);

			if(self.animation === "slide") {
				if(self.isFlex) {
					bannerWrapper.css("transitionDuration", "0ms");
					if(self.isHorizontal) {
						if((self.angle >= -45 && self.angle < 45) || (self.angle >= 135 && self.angle <= 180 || self.angle >= -180 && self.angle < -135)) {
							!self.animated && bannerWrapper.css("transform", "translate3d("+ (self.offset + (-(itemSize + itemSpacing) * curIndex) + translateOffset) +"px, 0, 0)");
						}
					}
					else {
						if((self.angle >= 45 && self.angle < 135) || (self.angle >= -135 && self.angle < -45)) {
							!self.animated && bannerWrapper.css("transform", "translate3d(0, "+ (self.offset + (-(itemSize + itemSpacing) * curIndex) + translateOffset) +"px, 0)");
						}
					}
				}
			}
		},
		// 绑定touchend
		onTouchEnd: function(e) {
			var self = this;
			e = e || window.event;
			self.stopPrevent(e);
			self.offsetTime = new Date().getTime() - self.startTime;
			if(Math.abs(self.dx) < 2 && Math.abs(self.dy) < 2) {
				return;
			}
			else {
				!self.animated && self.swiperDirection();
			}
		},
		// 运动
		play: function(curIndex) {
			var self = this;

			if(self.isFlex) {
				if(self.animation === "fade") {
					self.gradient(curIndex);
				}
				else if(self.animation === "cube") {
					self.rotate(curIndex);
				}
				else {
					self.translate(curIndex);
				}
				self.setTransition();
				self.transitionEnd();
			}
			else {
				if(self.animation === "fade") {
					self.changeOpacity(curIndex);
				}
				else {
					self.changePos(curIndex);
				}
			}
			self.setPagination(curIndex);
		},
		// 设置运动速度
		setTransition: function() {
			var self = this,
				itemsLen = self.getItemsLength();

			if(self.isSetStart && self.curIndex !== 0) {
				if(self.animation === "fade") {
					for(var i = 0; i < itemsLen; i++) {
						self.items.eq(i).css("transitionDuration", "0ms");
					}
				}
				else {
					self.bannerWrapper.css("transitionDuration", "0ms");
				}
				self.isSetStart = false;
				self.animated = false;
			}
			else {
				self.animated = true;
				if(self.animation === "fade") {
					for(var i = 0; i < itemsLen; i++) {
						self.items.eq(i).css("transitionDuration", self.speed + "ms");
					}
				}
				else {
					self.bannerWrapper.css("transitionDuration", self.speed +"ms");
				}
			}
		},
		// 动画结束后执行
		transitionEnd: function() {
			var self = this;
				
			if(self.animation === "cube") {
				self.rotateEnd();
			}
			else if(self.animation === "fade") {
				self.gradientEnd();
			}
			else {
				self.translateEnd();
			}
		},
		// 移动
		translate: function(curIndex) {
			var self = this,
				translateOffset = self.loop ? (self.itemSize + self.itemSpacing) : 0,
				translateDistance = (self.itemSize + self.itemSpacing) * curIndex + translateOffset;

			if(self.isHorizontal) {
				self.bannerWrapper.css("transform", "translate3d(-"+ translateDistance +"px, 0, 0)");
			}
			else {	
				self.bannerWrapper.css("transform", "translate3d(0, -" + translateDistance + "px, 0)");
			}
		},
		// 旋转
		rotate: function(curIndex) {
			var self = this,
				items = self.items,
				itemsLen = self.getItemsLength();
	
			var rotate = curIndex * 90;
			var rotateOffset = self.loop ? 90 : 0;
			for(var i = 0; i < itemsLen; i++) {
				items.eq(i).css("visibility", "hidden");
			}
			if(self.loop) {
				items.eq(curIndex) && items.eq(curIndex).css("visibility", "visible");
				items.eq(curIndex + 1) && items.eq(curIndex + 1).css("visibility", "visible");
				items.eq(curIndex + 2) && items.eq(curIndex + 2).css("visibility", "visible");
			}
			else {
				items.eq(curIndex) && items.eq(curIndex).css("visibility", "visible");
				items.eq(curIndex + 1) && items.eq(curIndex + 1).css("visibility", "visible");
				items.eq(curIndex - 1) && items.eq(curIndex - 1).css("visibility", "visible");
			}
			if(self.isHorizontal) {
				self.bannerWrapper.css("transform", "rotateY(-"+ (rotate + rotateOffset) +"deg)");
			}
			else {
				self.bannerWrapper.css("transform", "rotateX("+ (rotate + rotateOffset) +"deg)");
			}
		},
		// 渐变
		gradient: function(curIndex) {
			var self = this,
				itemsLen = self.getItemsLength();

			for(var i = 0; i < itemsLen; i++) {
				self.items.eq(i).css("opacity", "0");
			}
			if(self.loop) {
				self.items.eq(curIndex + 1).css("opacity", "1");
			}
			else {
				self.items.eq(curIndex).css("opacity", "1");
			}
		},
		// 移动(向下兼容)
		changePos: function(curIndex) {
			var self = this,
				animateObj = {},
				curIndex = self.loop ? curIndex + 1 : curIndex,
				animateProp = self.isHorizontal ? "left" : "top",
				endPos = -1 * curIndex * (self.itemSize + self.itemSpacing);

			if(self.isSetStart && self.curIndex !== 0) {
				self.isSetStart = false;
				self.isHorizontal && (self.bannerWrapper.css("left", endPos + "px"));
				!self.isHorizontal && (self.bannerWrapper.css("top", endPos + "px"));
				return;
			}
			self.animated = true;
			animateObj[animateProp] = endPos + "px";
			self.bannerWrapper.animate(animateObj, self.speed, function() {
				self.changePosEnd();
			});
		},
		// 渐变(向下兼容)
		changeOpacity: function(curIndex) {
			var self = this,
				items = self.items,
				itemsLen = self.getItemsLength(),
				curIndex = self.loop ? curIndex + 1 : curIndex;

			if(self.isSetStart && self.curIndex !== 0) {
				self.isSetStart = false;
				items.eq(curIndex).css("opacity", 1);
				(self.ieVersion <= 8) && items.eq(curIndex).css("filter", "alpha(opacity=100)");
				return;
			}
			self.animated = true;
			items.eq(curIndex).animate({"opacity": 1}, self.speed, function() {
				self.changeOpacityEnd();
			});
			if(self.ieVersion && self.ieVersion <= 8) {
				var curOpacity = Number(items.eq(curIndex).css("filter").replace(/[^0-9]/ig,"")),
					offsetOpacity = 100 - curOpacity,
					opacitySpeed = offsetOpacity / (self.speed / 100);
				for(var i = 0; i < itemsLen; i++) {
					items.eq(i).css("filter", "alpha(opacity=0)");
				}
				goOpacity();
			}
			function goOpacity() {
				curOpacity = Number(items.eq(curIndex).css("filter").replace(/[^0-9]/ig,""));
				if(curOpacity < 100) {
					items.eq(curIndex).css("filter", "alpha(opacity="+ (curOpacity + opacitySpeed) +")");
					setTimeout(goOpacity, 100);
				}
				else {
					self.changeOpacityEnd();
				}
			}
		},
		// 移动结束后处理
		translateEnd: function() {
			var self = this,
				translateOffset = 0,
				translateDistance = 0,
				itemsLen = self.getItemsLength(),
				bannerWrapper = self.bannerWrapper,
				translateOffset = self.loop ? (self.itemSize + self.itemSpacing) : 0;

			bannerWrapper.on("transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", function() {
				self.offset = 0;
				self.animated = false;
				bannerWrapper.css("transitionDuration", "0ms");
				if(self.loop) {
					if(self.curIndex >= itemsLen - 2) {
						self.curIndex = 0;
						translateDistance = (self.itemSize + self.itemSpacing) * self.curIndex + translateOffset;
						if(self.isHorizontal) {
							bannerWrapper.css("transform", "translate3d(-"+ translateDistance +"px, 0, 0)");					
						}
						else {
							bannerWrapper.css("transform", "translate3d(0, -"+ translateDistance +"px, 0)");
						}
					}
					else if(self.curIndex === -1) {
						self.curIndex = itemsLen - 3;
						translateDistance = (self.itemSize + self.itemSpacing) * self.curIndex + translateOffset;
						if(self.isHorizontal) {
							bannerWrapper.css("transform", "translate3d(-"+ translateDistance +"px, 0, 0)");
						}
						else {
							bannerWrapper.css("transform", "translate3d(0, -"+ translateDistance +"px, 0)");
						}
					}	
				}
			});
		},
		// 渐变结束后处理
		gradientEnd: function() {
			var self = this,
				items = self.items,
				itemsLen = self.getItemsLength(),
				curIndex = self.loop ? self.curIndex + 1 : self.curIndex;

			items.eq(curIndex).on("transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", function() {
				self.animated = false;
				self.offset = 0;
				for(var i = 0; i < itemsLen; i++) {
					items.eq(i).css("transitionDuration", "0ms");
				}
				if(self.loop) {
					if(self.curIndex >= itemsLen - 2) {
						self.curIndex = 0;
						items.eq(itemsLen - 1).css("opacity", 0);
						items.eq(self.curIndex + 1).css("opacity", 1);
					}
					else if(self.curIndex === -1) {
						self.curIndex = itemsLen - 3;
						items.eq(0).css("opacity", 0);
						items.eq(itemsLen - 2).css("opacity", 1);
					}
				}
			});
		},
		// 旋转结束后处理
		rotateEnd: function() {
			var self = this,
				items = self.items,
				itemsLen = self.getItemsLength(),
				bannerWrapper = self.bannerWrapper,
				rotateOffset = (self.loop === true) ? 90 : 0;

			bannerWrapper.on("transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", function() {
				self.animated = false;
				self.offset = 0;
				bannerWrapper.css("transitionDuration", "0ms");
				for(var i = 0; i < itemsLen; i++) {
					items.eq(i).css("visibility", "hidden");
				}	
				if(self.loop) {
					itemsLen = self.items.length;
					if(self.curIndex === itemsLen - 2) {
						self.curIndex = 0;
						if(self.isHorizontal) {
							bannerWrapper.css("transform", "rotateY(-"+ rotateOffset +"deg)");
						}
						else {
							bannerWrapper.css("transform", "rotateX("+ rotateOffset +"deg)");
						}
					}
					else if(self.curIndex === -1) {
						self.curIndex = itemsLen - 3;
						if(self.isHorizontal) {
							bannerWrapper.css("transform", "rotateY(-"+ (rotateOffset + 90 * self.curIndex) +"deg)")
						}
						else {
							bannerWrapper.css("transform", "rotateX("+ (rotateOffset + 90 * self.curIndex) +"deg)");
						}
					}
					items.eq(self.curIndex) && items.eq(self.curIndex).css("visibility", "visible");
					items.eq(self.curIndex + 1) && items.eq(self.curIndex + 1).css("visibility", "visible");
					items.eq(self.curIndex + 2) && items.eq(self.curIndex + 2).css("visibility", "visible");
				}
				else {
					items.eq(self.curIndex) && items.eq(self.curIndex).css("visibility", "visible");
					items.eq(self.curIndex + 1) && items.eq(self.curIndex + 1).css("visibility", "visible");
					items.eq(self.curIndex - 1) && items.eq(self.curIndex - 1).css("visibility", "visible");
				}
			});
		},
		// 移动结束后处理(向下兼容)
		changePosEnd: function() {
			var self = this,
				itemsLen = self.getItemsLength(),
				isHorizontal = self.isHorizontal,
				bannerWrapper = self.bannerWrapper,
				curIndex = self.loop ? self.curIndex + 1 : self.curIndex,
				endPos = -1 * curIndex * (self.itemSize + self.itemSpacing);

			if(self.loop) {
				if(self.curIndex >= itemsLen - 2) {
					self.curIndex = 0;
					endPos = -1 * (self.curIndex + 1) * (self.itemSize + self.itemSpacing);
					isHorizontal && (bannerWrapper.css("left", endPos + "px"));
					!isHorizontal && (bannerWrapper.css("top", endPos + "px"));
				}
				else if(self.curIndex === -1) {
					self.curIndex = itemsLen - 3;
					endPos = -1 * (self.curIndex + 1) * (self.itemSize + self.itemSpacing);
					isHorizontal && (bannerWrapper.css("left", endPos + "px"));
					!isHorizontal && (bannerWrapper.css("top", endPos + "px"));
				}
			}
			self.animated = false;
			self.offset = 0;
		},
		// 渐变结束后处理(向下兼容)
		changeOpacityEnd: function() {
			var self = this,
				items = self.items,
				itemsLen = self.getItemsLength(),
				curIndex = self.loop ? self.curIndex + 1 : self.curIndex;

			for(var i = 0; i < itemsLen; i++) {
				items.eq(i).css("opacity", "0");
			}
			items.eq(curIndex).css("opacity", 1);
			if(self.ieVersion && self.ieVersion <= 8) {
				items.eq(curIndex).css("filter", "alpha(opacity=100)")
			}
			if(self.loop) {
				if(self.curIndex >= itemsLen - 2) {
					self.curIndex = 0;
					items.eq(itemsLen - 1).css("opacity", 0);
					items.eq(self.curIndex + 1).css("opacity", 1);
					(self.ieVersion <= 8) && items.eq(itemsLen - 1).css("filter", "alpha(opacity=0)");
					(self.ieVersion <= 8) && items.eq(self.curIndex + 1).css("filter", "alpha(opacity=100)");
				}
				else if(self.curIndex === -1) {
					self.curIndex = itemsLen - 2;
					items.eq(0).css("opacity", 0);
					items.eq(itemsLen - 2).css("opacity", 1);
					(self.ieVersion <= 8) && items.eq(0).css("filter", "alpha(opacity=0)");
					(self.ieVersion <= 8) && items.eq(itemsLen - 2).css("filter", "alpha(opacity=100)");
				}
			}
			self.animated = false;
			self.offset = 0;
		},
		// 下一张
		next: function() {
			var self = this,
				itemsLen = self.getItemsLength();

			if(self.animated) return;
			self.curIndex++;	
			if(!self.loop && self.curIndex > itemsLen - 1) {
				self.curIndex = 0;
			}
			self.play(self.curIndex);		
		},
		// 上一张
		prev: function() {
			var self = this,
				itemsLen = self.getItemsLength();

			if(self.animated) return;
			self.curIndex--;			
			if(!self.loop && self.curIndex < 0) {
				self.curIndex = itemsLen - 1;
			}
			self.play(self.curIndex);
		},
		// 自动播放
		autoplay: function() {
			var self = this,
				interval = (typeof self.opts.interval === "number" && self.opts.interval > 0) ? parseInt(self.opts.interval) : 3000;

			self.timer = setInterval(function() {
				self.next();
			}, interval);
		},
		// 添加分页圆点
		pagination: function() {
			var self = this,
				paginationInitialClass = "banner-pagination-bullet",
				itemsLen = self.loop ? self.getItemsLength() - 2 : self.getItemsLength(),
				paginationClass = (typeof self.opts.paginationClass === "string") ? self.opts.paginationClass : "",
				paginationClickable = (typeof self.opts.paginationClickable === "boolean") ? self.opts.paginationClickable : true;

			self.paginationDom = $("<div class = 'banner-pagination'>");
			if(paginationClass !== "") {
				paginationInitialClass = paginationInitialClass + " " + paginationClass;
			}
			for(var i = 0; i < itemsLen; i++) {
				self.paginationDom.append("<span class = '"+ paginationInitialClass +"'></span>");
			}
			self.$ele.append(self.paginationDom);
			self.setPagination(0);
			if(paginationClickable) {
				self.addPaginationEvent();
			}
			if(self.isHorizontal) {
				self.paginationDom.css({
					"bottom": "10px",
					"width": "100%"
				});
			}
			else {
				if(!self.isFlex) {
					var paginationDomWidth = self.paginationDom.outerWidth();
					self.paginationDom.css("margin-top", -paginationDomWidth / 2 + "px");
				}
			}
		},
		// 设置分页
		setPagination: function(curIndex) {
			var self = this,
				paginationInitialActiveClass = "banner-pagination-bullet-active",
				bullets = self.opts.pagination ? self.paginationDom.children() : null,
				itemsLen = self.loop ? self.getItemsLength() - 2 : self.getItemsLength(),
				paginationClass = (self.opts.pagination && typeof self.opts.paginationClass === "string") ? self.opts.paginationClass : "",
				paginationActiveClass = (self.opts.pagination && typeof self.opts.paginationActiveClass === "string") ? self.opts.paginationActiveClass : "";
			
			if(!self.opts.pagination) return;
			if(paginationActiveClass !== "") {
				paginationInitialActiveClass = paginationInitialActiveClass + " " + paginationActiveClass;
			}
			for(var i = 0; i < bullets.length; i++) {
				bullets.eq(i).removeClass(paginationInitialActiveClass);
			}
			if(self.loop && curIndex < 0) {
				curIndex = itemsLen - 1;
			}
			else if(self.loop && curIndex === itemsLen) {
				curIndex = 0;
			}
			bullets.eq(curIndex).addClass(paginationInitialActiveClass);		
		},
		// 添加分页事件
		addPaginationEvent: function() {
			var self = this;

			self.paginationDom.on(self.eventType, "span", function(e) {
				e = e || window.event;
				self.stopPrevent(e);
				var index = $(this).index();
				if(self.curIndex === index) return;
				else {
					self.curIndex = index
					self.play(self.curIndex);
				}
			});
		},
		// 初始化事件
		initEvent: function() {
			var self = this,
				keyboard = (typeof self.opts.keyboard === "boolean") ? self.opts.keyboard : true,
				mousewheel = (typeof self.opts.mousewheel === "boolean") ? self.opts.mousewheel : false;

			if(self.judgePlatform() === "pc") {
				if(keyboard) {
					self.bindKeyEvent();
				}
				if(mousewheel) {
					self.mousewheel();
				}
				self.mouseHover();
			}
			self.swiperEvent();
		},
		// 绑定键盘事件
		bindKeyEvent: function() {
			var self = this;

			$(document).on("keydown", function(e) {
				e = e || window.event;
				var keycode = e.keyCode;
				if(self.isHorizontal) {
					// ←
					if(keycode === 37) {
						self.prev();
					}
					// →
					else if(keycode === 39) {
						self.next();
					}
				}
				else {
					// ↑
					if(keycode === 38) {
						self.prev();
					}
					// ↓
					else if(keycode === 40) {
						self.next();
					}
				}
			});
		},
		// 鼠标移入移出事件
		mouseHover: function() {
			var self = this;

			self.bannerWrapper.on("mouseover", function() {
				self.timer && clearInterval(self.timer);
			}).on("mouseout", function() {
				self.autoplay();
			});
		},
		// 鼠标滚轮事件
		mousewheel: function() {
			var self = this;

			$(document).on("mousewheel DOMMouseScroll", function(e) {
				e = e || window.event;
				var wheelDelta = e.originalEvent.wheelDelta;
				if(e.detail) {
					wheelDelta = -e.detail;
				}
				// 向上滑动滚轮
				if(wheelDelta > 0) {
					self.prev();
				}
				// 向下滑动滚轮
				else if(wheelDelta < 0){
					self.next();
				}
			});
		},
		// 添加前进后退图标
		arrow: function() {
			var self = this,
				prevArrow = $("<div class = 'banner-prev-arrow'>"),
				nextArrow = $("<div class = 'banner-next-arrow'>");

			self.$ele.append(prevArrow).append(nextArrow);
			prevArrow.on(self.eventType, function(e) {
				e = e || window.event;
				self.stopPrevent(e);
				self.prev();
			});
			nextArrow.on(self.eventType, function(e) {
				e = e || window.event;
				self.stopPrevent(e);
				self.next();
			});
		},
		// 获得ie的版本或者edge
		getIeVersion: function() {
			var ua = navigator.userAgent.toLowerCase();

			if(window.ActiveXObject) {
				if(ua.indexOf("compatible") > -1) {
					return parseInt(ua.match(/msie ([\d.]+)/)[1]);
				}
			}
			else if(ua.indexOf("trident") > -1) {
				return "edge";
			}
			else {
				return;
			}
		},
		// 处理 animation 的情况
		getAnimation: function() {
			var self = this,
				animation = (typeof self.opts.animation === "string") ? self.opts.animation : "slide";

			if(["slide", "fade", "cube"].indexOf(animation) === -1) {
				animation = "slide";
			}
			else if(!self.isFlex && animation === "cube") {
				animation = "slide";
			}
			else if(animation === "cube" && self.ieVersion !== undefined) {
				animation = "slide";
			}
			return animation;
		},
		// 判断是否支持flex
		isSupportFlex: function() {
			if(this._prefix("box") || this._prefix("flex") || this._prefix("flexbox")) {
				return true;
			}
			return false;
		},
		// 判断平台(pc or mobile)
		judgePlatform: function() {
			var userAgent = navigator.userAgent.toLowerCase(),
		    	agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"],
		    	platform = "";
		    for (var i = 0; i < agents.length; i++) {
		        if (userAgent.indexOf(agents[i]) > 0) {
		            platform = "mobile";
		            break;
		        }
		        else {
		        	platform = "pc";
		        }
		    }
		    return platform;
		},
		// 获得item的数量
		getItemsLength: function() {
			return this.items.length;
		},
		// 返回适合当前浏览器版本的css属性，否则返回false
		_prefix: function(prop) {
			var style = document.createElement("dummy").style,  
		        prefixes = ["webkit", "moz", "o", "ms"],
		        prefixeProp = "";

		    if(style[prop] !== undefined) {
		    	return prop;
		    }
		    else {
	    		prop = prop.charAt(0).toUpperCase() + prop.substr(1);
		    	for(var i in prefixes) {
		    		prefixeProp = prefixes[i].toString().toLowerCase() + prop;
		    		if(style[prefixeProp] !== undefined) {
		    			return prefixeProp;
		    		}
		    	}
		    	return false;		    	
		    }
		},
	};
	$.fn.Banner = function(opts) {
		return this.each(function() {
			new Banner($(this), opts);
		});
	};
	$.fn.Banner.defaults = {
		loop: true,							// 是否循环播放
		speed: 500,							// 运动的速度
		arrow: false,						// 是否显示前进后退按钮
		startIndex: 0,						// 起始的item
		interval: 3000,						// 间隔时间
		itemSpacing: 0,						// item之间的间距
		keyboard: true,						// 是否响应键盘事件
		autoplay: true,						// 是否自动播放
		pagination: true,					// 是否显示分页
		mousewheel: true,					// 是否响应鼠标滚轮事件
		animation: "slide",       			// 动画效果cube, fade, 默认slide
		direction: "horizontal",  			// 运动的方向vertical, 默认horizontal
		paginationClickable: true,			// 分页是否响应点击事件
		paginationClass: "",				// 分页的样式
		paginationActiveClass: ""			// 选中分页的样式
	}
})(jQuery);