import { IOptions } from '../types';
import { createDom, judgePlatform, getBestStyle, isSupportFlex } from './utils';
import './banner.less';

class Banner {
  // 配置参数
  opts: IOptions = {
    loop: true, // 是否循环播放
    speed: 500, // 运动的速度
    arrow: false, // 是否显示前进后退按钮
    startIndex: 0, // 起始的item
    interval: 3000, // 间隔时间
    itemSpacing: 0, // item之间的间距
    keyboard: true, // 是否响应键盘事件
    autoplay: true, // 是否自动播放
    pagination: true, // 是否显示分页
    mousewheel: true, // 是否响应鼠标滚轮事件
    animation: 'slide', // 动画效果cube, fade, 默认slide
    direction: 'horizontal', // 运动的方向vertical, 默认horizontal
    paginationClickable: true, // 分页是否响应点击事件
    paginationClass: '', // 分页的样式
    paginationActiveClass: '' // 当前激活分页的样式
  };
  // 容器盒子
  ele: HTMLElement | null;

  constructor(selector: string = '.banner', opts: IOptions = {}) {
    if (!this instanceof Banner) {
      return new Banner(selector, opts);
    }

    this.ele = document.querySelector(selector);
    if (!this.ele) {
      throw new Error('can not find ele: ' + this.ele);
    }

    this.opts = {
      ...this.opts,
      ...opts
    };

    this.init();
  }

  // 初始化
  init(): void {
    const { loop, arrow, autoplay, pagination, startIndex } = this.opts;

    // init config opts
    this.animated = false; // 初始化运动状态
    this.ieVersion = this.getIeVersion(); // 获得ie的版本
    this.isFlex = isSupportFlex(); // 是否支持 flex 属性
    this.animation = this.getAnimation(); // 获得运动的效果
    this.bannerWrapper = this.ele.querySelector('.banner-wrapper');
    this.items = this.bannerWrapper.querySelectorAll('.banner-item');
    this.isHorizontal = this.opts.direction !== 'vertical';
    this.eventType = judgePlatform() === 'pc' ? 'click' : 'touchstart';
    this.curIndex =
      startIndex > 0 && startIndex < this.getItemsLength() ? startIndex : 0;
    this.itemSize = this.isHorizontal
      ? this.items[0].offsetWidth
      : this.items[0].offsetHeight;

    if (!this.isFlex) {
      this.dealClass(this.ele, 'banner-no-flexbox', 'addClass');
    }
    if (loop) {
      this.createLoop();
    }
    if (
      this.opts.animation === 'cube' &&
      (!this.isFlex || this.ieVersion !== undefined)
    ) {
      alert('您的浏览器暂不支持3D动画，请使用最新版的chrome浏览器！');
    }
    if (this.animation === 'fade') {
      this.fade();
    } else if (this.animation === 'cube') {
      this.cube();
    } else {
      this.slide();
    }
    if (pagination) {
      this.pagination();
    }
    if (arrow) {
      this.arrow();
    }
    if (autoplay) {
      this.autoplay();
    }
    if (this.opts.itemSpacing && this.animation === 'slide') {
      this.setItemSpace(this.opts.itemSpacing);
    }
    if (!this.isHorizontal) {
      this.vertical();
    }
    if (this.curIndex) {
      this.isSetStart = true;
      this.play(this.curIndex);
    }
    this.initEvent();
  }
  // 循环
  createLoop(): void {
    const firstItem = this.items[0].cloneNode(true);
    const lastItem = this.items[this.items.length - 1].cloneNode(true);

    this.bannerWrapper.appendChild(firstItem);
    this.bannerWrapper.insertBefore(lastItem, this.items[0]);
    this.items = this.bannerWrapper.querySelectorAll('.banner-item');
    this.updateWrapper();
  }
  // 更新item
  updateWrapper(): void {
    const { itemSize, itemSpacing } = this;
    const curIndex = this.curIndex + 1;

    if (this.animation === 'slide') {
      if (this.isFlex) {
        this.css(this.bannerWrapper, 'transitionDuration', '0ms');
        if (this.isHorizontal) {
          this.css(
            this.bannerWrapper,
            'transform',
            `translate3d(-${(itemSize + itemSpacing) * curIndex}px, 0, 0)`
          );
        } else {
          this.css(
            this.bannerWrapper,
            'transform',
            `translate3d(0, -${(itemSize + itemSpacing) * curIndex}px, 0)`
          );
        }
      } else {
        if (this.isHorizontal) {
          this.css(
            this.bannerWrapper,
            'left',
            `-${(itemSize + itemSpacing) * curIndex}px`
          );
        } else {
          this.css(
            this.bannerWrapper,
            'top',
            `-${(itemSize + itemSpacing) * curIndex}px`
          );
        }
      }
    }
  }
  // 设置间距
  setItemSpace(itemSpacing): void {
    const itemsLen = this.getItemsLength();

    for (let i = 0; i < itemsLen; i++) {
      if (this.isHorizontal) {
        this.isFlex &&
          this.css(this.items[i], 'marginRight', `${itemSpacing}px`);
      } else {
        this.css(this.items[i], 'marginBottom', `${itemSpacing}px`);
      }
    }
  }
  // 设置竖屏
  vertical(): void {
    this.dealClass(this.ele, 'banner-vertical', 'addClass').css(
      this.bannerWrapper,
      'height',
      `${this.itemSize}px`
    );
  }
  // 3D立方体效果
  cube(): void {
    const { items, itemSize, isHorizontal, bannerWrapper } = this;
    const itemsLen = this.getItemsLength();
    const rotateOffset = this.opts.loop ? 90 : 0;
    const curIndex = this.opts.loop ? this.curIndex + 1 : this.curIndex;

    for (let i = 0; i < itemsLen; i++) {
      const rotateAngle = i * 90;
      const round = Math.floor(i / 4);
      if (isHorizontal) {
        if (i % 4 === 0) {
          this.css(
            items[i],
            'transform',
            `rotateY(${rotateAngle}deg) translate3d(${-round *
              4 *
              itemSize}px, 0, 0)`
          );
        } else if (i % 4 === 1) {
          this.css(
            items[i],
            'transform',
            `rotateY(${rotateAngle}deg) translate3d(0, 0, ${-round *
              4 *
              itemSize}px)`
          );
        } else if (i % 4 === 2) {
          this.css(
            items[i],
            'transform',
            `rotateY(${rotateAngle}deg) translate3d(${itemSize +
              round * 4 * itemSize}px, 0, ${itemSize}px)`
          );
        } else if (i % 4 === 3) {
          this.css(
            items[i],
            'transform',
            `rotateY(${rotateAngle}deg) translate3d(-${itemSize}px, 0, ${3 *
              itemSize +
              itemSize * 4 * round}px)`
          );
        }
      } else {
        if (i % 4 === 0) {
          this.css(
            items[i],
            'transform',
            `rotateX(-${rotateAngle}deg) translate3d(0, ${-round *
              4 *
              itemSize}px, 0)`
          );
        } else if (i % 4 === 1) {
          this.css(
            items[i],
            'transform',
            `rotateX(-${rotateAngle}deg) translate3d(0, 0, ${-round *
              4 *
              itemSize}px)`
          );
        } else if (i % 4 === 2) {
          this.css(
            items[i],
            'transform',
            `rotateX(-${rotateAngle}deg) translate3d(0, ${itemSize +
              round * 4 * itemSize}px, ${itemSize}px)`
          );
        } else if (i % 4 === 3) {
          this.css(
            items[i],
            'transform',
            `rotateX(-${rotateAngle}deg) translate3d(0, -${itemSize}px, ${3 *
              itemSize +
              itemSize * 4 * round}px)`
          );
        }
      }
    }
    this.dealClass(this.ele, 'banner-cube', 'addClass')
      .css(items[curIndex], 'visibility', 'visible')
      .css(bannerWrapper, 'transformOrigin', `50% 50% -${itemSize / 2}px`);
    this.opts.loop && this.css(bannerWrapper, 'transitionDuration', '0ms');
    !isHorizontal &&
      this.css(bannerWrapper, 'transform', `rotateX(${rotateOffset}deg)`);
    isHorizontal &&
      this.css(bannerWrapper, 'transform', `rotateY(-${rotateOffset}deg)`);
  }
  // 淡入淡出效果
  fade(): void {
    const items = this.items;
    const itemsLen = this.getItemsLength();
    const curIndex = this.opts.loop ? this.curIndex + 1 : this.curIndex;

    for (let i = 0; i < itemsLen; i++) {
      if (this.isFlex) {
        this.css(items[i], {
          transitionDuration: '0ms',
          opacity: 0
        });
        this.ieVersion <= 8 && this.css(items[i], 'filter', 'alpha(opacity=0)');
        if (this.isHorizontal) {
          this.css(
            items[i],
            'transform',
            `translate3d(-${this.itemSize * i}px, 0, 0)`
          );
        } else {
          this.css(
            items[i],
            'transform',
            `translate3d(0, -${this.itemSize * i}px, 0)`
          );
        }
      } else {
        this.css(items[i], {
          position: 'absolute',
          top: 0,
          opacity: 0
        });
        this.ieVersion <= 8 && this.css(items[i], 'filter', 'alpha(opacity=0)');
      }
    }
    this.dealClass(this.ele, 'banner-fade', 'addClass').css(
      items[curIndex],
      'opacity',
      1
    );
    this.ieVersion <= 8 &&
      this.css(items[curIndex], 'filter', 'alpha(opacity=100)');
  }
  // 滑动效果
  slide(): void {
    if (this.isFlex) return;

    const itemsLen = this.getItemsLength();
    if (this.isHorizontal) {
      !this.opts.loop && this.css(this.bannerWrapper, 'left', 0);
      for (let i = 0; i < itemsLen; i++) {
        const left =
          i === 0
            ? this.itemSize * i
            : (this.itemSize + this.opts.itemSpacing) * i;
        this.css(this.items[i], 'left', `${left}px`);
      }
    } else {
      !this.opts.loop && this.css(this.bannerWrapper, 'top', 0);
    }
  }
  // 绑定滑动事件
  swiperEvent(): void {
    let isMove = false;
    const platform = judgePlatform();
    const targetDom = this.bannerWrapper;
    const startEvent = platform === 'pc' ? 'mousedown' : 'touchstart';
    const moveEvent = platform === 'pc' ? 'mousemove' : 'touchmove';
    const endEvent = platform === 'pc' ? 'mouseup' : 'touchend';

    this.on(targetDom, startEvent, evt => {
      isMove = true;
      this.onTouchstart(evt);
    })
      .on(platform === 'pc' ? document : targetDom, moveEvent, evt => {
        isMove && this.onTouchmove(evt);
        if (this.timer && platform === 'pc') {
          this.isMove && clearInterval(this.timer);
        }
      })
      .on(platform === 'pc' ? document : targetDom, endEvent, evt => {
        isMove = false;
        this.onTouchEnd(evt);
      });
  }
  // 判断滑动方向
  swiperDirection(): void {
    const angle = this.angle;
    const boundary = this.offsetTime > 500 ? parseInt(this.itemSize / 2) : 50;

    const swiperHorizontal = (boundary): void => {
      // left or ←
      if (this.offset >= boundary && (angle >= -45 && angle < 45)) {
        this.prev();
      }
      // right or →
      else if (
        this.offset < -boundary &&
        ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135))
      ) {
        this.next();
      } else if (this.offset !== undefined && this.offset !== 0) {
        if (
          (angle >= -45 && angle < 45) ||
          ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135))
        ) {
          !this.animated && this.play(this.curIndex);
        }
      }
    };
    const swiperVertical = (boundary): void => {
      // top or ↑
      if (this.offset >= boundary && (angle >= 45 && angle < 135)) {
        this.prev();
      }
      // down or ↓
      else if (this.offset < -boundary && (angle >= -135 && angle < -45)) {
        this.next();
      } else if (this.offset !== 0) {
        if ((angle >= 45 && angle < 135) || (angle >= -135 && angle < -45)) {
          !this.animated && this.play(this.curIndex);
        }
      }
    };
    if (this.isHorizontal) {
      swiperHorizontal(boundary);
    } else {
      swiperVertical(boundary);
    }
  }
  // 阻止默认, 防止冒泡
  stopPrevent(evt): void {
    if (evt.stopPropagation) {
      evt.stopPropagation();
      evt.preventDefault();
    } else {
      evt.cancelBubble = true;
      evt.returnValue = false;
    }
  }
  // 绑定touchstart
  onTouchstart(evt): void {
    evt = evt || window.event;
    this.stopPrevent(evt);
    this.startTime = new Date().getTime();
    this.startX =
      evt.type === 'touchstart'
        ? evt.targetTouches[0].pageX
        : evt.pageX || evt.clientX;
    this.startY =
      evt.type === 'touchstart'
        ? evt.targetTouches[0].pageY
        : evt.pageY || evt.clientY;
  }
  // 绑定touchmove
  onTouchmove(evt): void {
    evt = evt || window.event;
    const {
      itemSize,
      curIndex,
      itemSpacing,
      isHorizontal,
      bannerWrapper
    } = this;
    const endX =
      evt.type === 'touchmove'
        ? evt.targetTouches[0].pageX
        : evt.pageX || evt.clientX;
    const endY =
      evt.type === 'touchmove'
        ? evt.targetTouches[0].pageY
        : evt.pageY || evt.clientY;
    const translateOffset =
      this.opts.loop === true ? -(itemSize + itemSpacing) : 0;

    this.stopPrevent(evt);
    this.dx = endX - this.startX;
    this.dy = endY - this.startY;
    this.offset = isHorizontal ? this.dx : this.dy;
    this.angle = parseInt((Math.atan2(this.dy, this.dx) * 180) / Math.PI);

    if (this.animation === 'slide') {
      if (this.isFlex) {
        this.css(bannerWrapper, 'transitionDuration', '0ms');
        if (isHorizontal) {
          if (
            (this.angle >= -45 && this.angle < 45) ||
            ((this.angle >= 135 && this.angle <= 180) ||
              (this.angle >= -180 && this.angle < -135))
          ) {
            !this.animated &&
              this.css(
                bannerWrapper,
                'transform',
                `translate3d(${this.offset +
                  -(itemSize + itemSpacing) * curIndex +
                  translateOffset}px, 0, 0)`
              );
          }
        } else {
          if (
            (this.angle >= 45 && this.angle < 135) ||
            (this.angle >= -135 && this.angle < -45)
          ) {
            !this.animated &&
              this.css(
                bannerWrapper,
                'transform',
                `translate3d(0, ${this.offset +
                  -(itemSize + itemSpacing) * curIndex +
                  translateOffset}px, 0)`
              );
          }
        }
      }
    }
  }
  // 绑定touchend
  onTouchEnd(evt): void {
    evt = evt || window.event;
    this.stopPrevent(evt);
    this.offsetTime = new Date().getTime() - this.startTime;
    if (Math.abs(this.dx) < 2 && Math.abs(this.dy) < 2) return;
    !this.animated && this.swiperDirection();
  }
  // 运动
  play(curIndex): void {
    if (this.isFlex) {
      if (this.animation === 'fade') {
        this.gradient(curIndex);
      } else if (this.animation === 'cube') {
        this.rotate(curIndex);
      } else {
        this.translate(curIndex);
      }
      this.setTransition();
      this.transitionEnd();
    } else {
      if (this.animation === 'fade') {
        this.changeOpacity(curIndex);
      } else {
        this.changePos(curIndex);
      }
    }
    this.setPagination(curIndex);
  }
  // 设置运动速度
  setTransition(): void {
    const itemsLen = this.getItemsLength();

    if (this.isSetStart && this.curIndex !== 0) {
      if (this.animation === 'fade') {
        for (let i = 0; i < itemsLen; i++) {
          this.css(this.items[i], 'transitionDuration', '0ms');
        }
      } else {
        this.css(this.bannerWrapper, 'transitionDuration', '0ms');
      }
      this.isSetStart = false;
      this.animated = false;
    } else {
      this.animated = true;
      if (this.animation === 'fade') {
        for (let i = 0; i < itemsLen; i++) {
          this.css(this.items[i], 'transitionDuration', `${this.opts.speed}ms`);
        }
      } else {
        this.css(
          this.bannerWrapper,
          'transitionDuration',
          `${this.opts.speed}ms`
        );
      }
    }
  }
  // 动画结束后执行
  transitionEnd(): void {
    if (this.animation === 'cube') {
      this.rotateEnd();
    } else if (this.animation === 'fade') {
      this.gradientEnd();
    } else {
      this.translateEnd();
    }
  }
  // 移动
  translate(curIndex): void {
    const translateOffset = this.opts.loop
      ? this.itemSize + this.opts.itemSpacing
      : 0;
    const translateDistance =
      (this.itemSize + this.opts.itemSpacing) * curIndex + translateOffset;

    if (this.isHorizontal) {
      this.css(
        this.bannerWrapper,
        'transform',
        `translate3d(-${translateDistance}px, 0, 0)`
      );
    } else {
      this.css(
        this.bannerWrapper,
        'transform',
        `translate3d(0, -${translateDistance}px, 0)`
      );
    }
  }
  // 旋转
  rotate(curIndex): void {
    const items = this.items;
    const itemsLen = this.getItemsLength();
    const rotate = curIndex * 90;
    const rotateOffset = this.opts.loop ? 90 : 0;

    for (let i = 0; i < itemsLen; i++) {
      this.css(items[i], 'visibility', 'hidden');
    }
    if (this.opts.loop) {
      items[curIndex] && this.css(items[curIndex], 'visibility', 'visible');
      items[curIndex + 1] &&
        this.css(items[curIndex + 1], 'visibility', 'visible');
      items[curIndex + 2] &&
        this.css(items[curIndex + 2], 'visibility', 'visible');
    } else {
      items[curIndex] && this.css(items[curIndex], 'visibility', 'visible');
      items[curIndex + 1] &&
        this.css(items[curIndex + 1], 'visibility', 'visible');
      items[curIndex - 1] &&
        this.css(items[curIndex - 1], 'visibility', 'visible');
    }
    if (this.isHorizontal) {
      this.css(
        this.bannerWrapper,
        'transform',
        `rotateY(-${rotate + rotateOffset}deg)`
      );
    } else {
      this.css(
        this.bannerWrapper,
        'transform',
        `rotateX(${rotate + rotateOffset}deg)`
      );
    }
  }
  // 渐变
  gradient(curIndex): void {
    const itemsLen = this.getItemsLength();
    curIndex = this.opts.loop === true ? curIndex + 1 : curIndex;

    for (let i = 0; i < itemsLen; i++) {
      this.css(this.items[i], 'opacity', '0');
    }
    this.css(this.items[curIndex], 'opacity', '1');
  }
  // 滑动(向下兼容)
  changePos(curIndex): void {
    const interval = 10;
    const { isHorizontal, bannerWrapper } = this;
    curIndex = this.opts.loop ? curIndex + 1 : curIndex;
    let curPos = isHorizontal
      ? parseInt(bannerWrapper.style.left)
      : parseInt(bannerWrapper.style.top);
    const endPos = -1 * curIndex * (this.itemSize + this.opts.itemSpacing);
    const offsetLeft = endPos - curPos;
    const translateSpeed = parseInt(offsetLeft / (this.opts.speed / interval));

    if (this.isSetStart && this.curIndex !== 0) {
      this.isSetStart = false;
      isHorizontal && this.css(bannerWrapper, 'left', `${endPos} + px`);
      !isHorizontal && this.css(bannerWrapper, 'top', `${endPos} + px`);
      return;
    }
    if (offsetLeft === 0) return;

    const go = (): void => {
      this.animated = true;
      curPos = isHorizontal
        ? parseInt(bannerWrapper.style.left)
        : parseInt(bannerWrapper.style.top);
      if (
        (translateSpeed < 0 && curPos > endPos) ||
        (translateSpeed > 0 && curPos < endPos)
      ) {
        isHorizontal &&
          this.css(bannerWrapper, 'left', `${curPos + translateSpeed}px`);
        !isHorizontal &&
          this.css(bannerWrapper, 'top', `${curPos + translateSpeed}px`);
        setTimeout(go, interval);
      } else {
        this.changePosEnd();
      }
    };
    go();
  }
  // 渐变(向下兼容)
  changeOpacity(curIndex): void {
    const items = this.items;
    const itemsLen = this.getItemsLength();
    const endOpacity = this.ieVersion <= 8 ? 100 : 1;
    curIndex = this.opts.loop ? curIndex + 1 : curIndex;
    let curOpacity =
      this.ieVersion <= 8
        ? Number(items[curIndex].style.filter.replace(/[^0-9]/gi, ''))
        : Number(items[curIndex].style.opacity);
    const offsetOpacity = endOpacity - curOpacity;
    const opacitySpeed = offsetOpacity / (this.opts.speed / 100);

    for (let i = 0; i < itemsLen; i++) {
      this.css(items[i], 'opacity', '0');
      this.ieVersion <= 8 && this.css(items[i], 'filter', 'alpha(opacity=0)');
    }
    if (this.isSetStart && this.curIndex !== 0) {
      this.isSetStart = false;
      this.css(items[curIndex], 'opacity', endOpacity);
      this.ieVersion <= 8 &&
        this.css(items[curIndex], 'filter', `alpha(opacity=${endOpacity})`);
      return;
    }
    if (offsetOpacity === 0) return;
    const goOpacity = (): void => {
      this.animated = true;
      curOpacity =
        this.ieVersion <= 8
          ? Number(items[curIndex].style.filter.replace(/[^0-9]/gi, ''))
          : Number(items[curIndex].style.opacity);
      if (curOpacity < endOpacity) {
        this.css(items[curIndex], 'opacity', curOpacity + opacitySpeed);
        this.ieVersion <= 8 &&
          this.css(
            items[curIndex],
            'filter',
            `alpha(opacity=${curOpacity + opacitySpeed})`
          );
        setTimeout(goOpacity, 100);
      } else {
        this.changeOpacityEnd();
      }
    };
    goOpacity();
  }
  // 移动结束后处理
  translateEnd(): void {
    let translateDistance = 0;
    const itemsLen = this.getItemsLength();
    const bannerWrapper = this.bannerWrapper;
    const translateOffset = this.opts.loop
      ? this.itemSize + this.opts.itemSpacing
      : 0;

    this.on(
      bannerWrapper,
      'transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd',
      () => {
        this.offset = 0;
        this.animated = false;
        this.css(bannerWrapper, 'transitionDuration', '0ms');
        if (this.opts.loop) {
          if (this.curIndex >= itemsLen - 2) {
            this.curIndex = 0;
            translateDistance =
              (this.itemSize + this.opts.itemSpacing) * this.curIndex +
              translateOffset;
            if (this.isHorizontal) {
              this.css(
                bannerWrapper,
                'transform',
                `translate3d(-${translateDistance}px, 0, 0)`
              );
            } else {
              this.css(
                bannerWrapper,
                'transform',
                `translate3d(0, -${translateDistance}px, 0)`
              );
            }
          } else if (this.curIndex === -1) {
            this.curIndex = itemsLen - 3;
            translateDistance =
              (this.itemSize + this.opts.itemSpacing) * this.curIndex +
              translateOffset;
            if (this.isHorizontal) {
              this.css(
                bannerWrapper,
                'transform',
                `translate3d(-${translateDistance}px, 0, 0)`
              );
            } else {
              this.css(
                bannerWrapper,
                'transform',
                `translate3d(0, -${translateDistance}px, 0)`
              );
            }
          }
        }
      }
    );
  }
  // 渐变结束后处理
  gradientEnd(): void {
    const items = this.items;
    const itemsLen = this.getItemsLength();
    const curIndex = this.opts.loop ? this.curIndex + 1 : this.curIndex;

    this.on(
      items[curIndex],
      'transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd',
      () => {
        this.animated = false;
        this.offset = 0;
        for (let i = 0; i < itemsLen; i++) {
          this.css(items[i], 'transitionDuration', '0ms');
        }
        if (this.opts.loop) {
          if (this.curIndex >= itemsLen - 2) {
            this.curIndex = 0;
            this.css(items[itemsLen - 1], 'opacity', 0).css(
              items[this.curIndex + 1],
              'opacity',
              1
            );
          } else if (this.curIndex === -1) {
            this.curIndex = itemsLen - 3;
            this.css(items[0], 'opacity', 0).css(
              items[itemsLen - 2],
              'opacity',
              1
            );
          }
        }
      }
    );
  }
  // 旋转结束后处理
  rotateEnd(): void {
    const items = this.items;
    let itemsLen = this.getItemsLength();
    const bannerWrapper = this.bannerWrapper;
    const rotateOffset = this.opts.loop ? 90 : 0;

    this.on(
      bannerWrapper,
      'transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd',
      () => {
        this.animated = false;
        this.offset = 0;
        this.css(bannerWrapper, 'transitionDuration', '0ms');
        for (let i = 0; i < itemsLen; i++) {
          this.css(items[i], 'visibility', 'hidden');
        }
        if (this.opts.loop) {
          itemsLen = this.items.length;
          if (this.curIndex === itemsLen - 2) {
            this.curIndex = 0;
            if (this.isHorizontal) {
              this.css(
                bannerWrapper,
                'transform',
                `rotateY(-${rotateOffset}deg)`
              );
            } else {
              this.css(
                bannerWrapper,
                'transform',
                `rotateX(${rotateOffset}deg)`
              );
            }
          } else if (this.curIndex === -1) {
            this.curIndex = itemsLen - 3;
            if (this.isHorizontal) {
              this.css(
                bannerWrapper,
                'transform',
                `rotateY(-${rotateOffset + 90 * this.curIndex}deg)`
              );
            } else {
              this.css(
                bannerWrapper,
                'transform',
                `rotateX(${rotateOffset + 90 * this.curIndex}deg)`
              );
            }
          }
          items[this.curIndex] &&
            this.css(items[this.curIndex], 'visibility', 'visible');
          items[this.curIndex + 1] &&
            this.css(items[this.curIndex + 1], 'visibility', 'visible');
          items[this.curIndex + 2] &&
            this.css(items[this.curIndex + 2], 'visibility', 'visible');
        } else {
          items[this.curIndex] &&
            this.css(items[this.curIndex], 'visibility', 'visible');
          items[this.curIndex + 1] &&
            this.css(items[this.curIndex + 1], 'visibility', 'visible');
          items[this.curIndex - 1] &&
            this.css(items[this.curIndex - 1], 'visibility', 'visible');
        }
      }
    );
  }
  // 移动结束后处理(向下兼容)
  changePosEnd(): void {
    const itemsLen = this.getItemsLength();
    const isHorizontal = this.isHorizontal;
    const bannerWrapper = this.bannerWrapper;
    const curIndex = this.opts.loop ? this.curIndex + 1 : this.curIndex;
    let endPos = -1 * curIndex * (this.itemSize + this.opts.itemSpacing);

    isHorizontal && this.css(bannerWrapper, 'left', `${endPos}px`);
    !isHorizontal && this.css(bannerWrapper, 'top', `${endPos}px`);
    if (this.opts.loop) {
      if (this.curIndex >= itemsLen - 2) {
        this.curIndex = 0;
        endPos =
          -1 * (this.curIndex + 1) * (this.itemSize + this.opts.itemSpacing);
        isHorizontal && this.css(bannerWrapper, 'left', `${endPos}px`);
        !isHorizontal && this.css(bannerWrapper, 'top', `${endPos}px`);
      } else if (this.curIndex === -1) {
        this.curIndex = itemsLen - 3;
        endPos =
          -1 * (this.curIndex + 1) * (this.itemSize + this.opts.itemSpacing);
        isHorizontal && this.css(bannerWrapper, 'left', `${endPos}px`);
        !isHorizontal && this.css(bannerWrapper, 'top', `${endPos}px`);
      }
    }
    this.animated = false;
    this.offset = 0;
  }
  // 渐变结束后处理(向下兼容)
  changeOpacityEnd(): void {
    const items = this.items;
    const itemsLen = this.getItemsLength();
    const curIndex = this.opts.loop ? this.curIndex + 1 : this.curIndex;

    this.css(items[curIndex], 'opacity', 1);
    this.ieVersion <= 8 &&
      this.css(items[curIndex], 'filter', 'alpha(opacity=100)');
    if (this.opts.loop) {
      if (this.curIndex >= itemsLen - 2) {
        this.curIndex = 0;
        this.css(items[itemsLen - 1], 'opacity', 0).css(
          items[this.curIndex + 1],
          'opacity',
          1
        );
        this.ieVersion <= 8 &&
          this.css(items[itemsLen - 1], 'filter', 'alpha(opacity=0)').css(
            items[this.curIndex + 1],
            'filter',
            'alpha(opacity=100)'
          );
      } else if (this.curIndex === -1) {
        this.curIndex = itemsLen - 2;
        this.css(items[0], 'opacity', 0).css(items[itemsLen - 2], 'opacity', 1);
        this.ieVersion <= 8 &&
          this.css(items[0], 'filter', 'alpha(opacity=0)').css(
            items[itemsLen - 2],
            'filter',
            'alpha(opacity=100)'
          );
      }
    }
    this.animated = false;
    this.offset = 0;
  }
  // 下一张
  next(): void {
    const itemsLen = this.getItemsLength();

    if (this.animated) return;
    this.curIndex++;
    if (!this.opts.loop && this.curIndex > itemsLen - 1) {
      this.curIndex = 0;
    }
    this.play(this.curIndex);
  }
  // 上一张
  prev(): void {
    const itemsLen = this.getItemsLength();

    if (this.animated) return;
    this.curIndex--;
    if (!this.opts.loop && this.curIndex < 0) {
      this.curIndex = itemsLen - 1;
    }
    this.play(this.curIndex);
  }
  // 自动播放
  autoplay(): void {
    const interval =
      typeof this.opts.interval === 'number' && this.opts.interval > 0
        ? parseInt(this.opts.interval)
        : 3000;

    this.timer = setInterval(() => {
      this.next();
    }, interval);
  }
  // 添加分页圆点
  pagination(): void {
    let paginationInitialClass = 'banner-pagination-bullet';
    const itemsLen = this.opts.loop
      ? this.getItemsLength() - 2
      : this.getItemsLength();
    const paginationClass =
      typeof this.opts.paginationClass === 'string'
        ? this.opts.paginationClass
        : '';
    const paginationClickable =
      typeof this.opts.paginationClickable === 'boolean'
        ? this.opts.paginationClickable
        : true;

    this.paginationDom = createDom('div');
    this.paginationDom.className = 'banner-pagination';

    if (paginationClass !== '') {
      paginationInitialClass = paginationInitialClass + ' ' + paginationClass;
    }
    for (let i = 0; i < itemsLen; i++) {
      this.paginationDom.innerHTML += `<span class = "${paginationInitialClass}"></span>`;
    }
    this.ele.appendChild(this.paginationDom);
    this.setPagination(0);
    if (paginationClickable) {
      this.addPaginationEvent();
    }
    if (this.isHorizontal) {
      this.css(this.paginationDom, {
        bottom: '10px',
        width: '100%'
      });
    } else {
      if (!this.isFlex) {
        const paginationDomWidth = this.paginationDom.offsetWidth;
        this.css(
          this.paginationDom,
          'margin-top',
          `-${paginationDomWidth / 2}px`
        );
      }
    }
  }
  // 设置分页
  setPagination(curIndex: number): void {
    let paginationInitialActiveClass = 'banner-pagination-bullet-active';
    const bullets = this.opts.pagination ? this.paginationDom.childNodes : null;
    const itemsLen = this.opts.loop
      ? this.getItemsLength() - 2
      : this.getItemsLength();
    const paginationActiveClass =
      this.opts.pagination &&
      typeof this.opts.paginationActiveClass === 'string'
        ? this.opts.paginationActiveClass
        : '';

    if (!this.opts.pagination) return;
    if (paginationActiveClass !== '') {
      paginationInitialActiveClass =
        paginationInitialActiveClass + ' ' + paginationActiveClass;
    }
    for (let i = 0; i < bullets.length; i++) {
      this.dealClass(bullets[i], paginationInitialActiveClass, 'removeClass');
    }
    if (this.opts.loop && curIndex < 0) {
      curIndex = itemsLen - 1;
    } else if (this.opts.loop && curIndex === itemsLen) {
      curIndex = 0;
    }
    this.dealClass(bullets[curIndex], paginationInitialActiveClass, 'addClass');
  }
  // 添加分页事件
  addPaginationEvent(): void {
    let index = 0;
    let targetDom = null;
    const bullets = this.paginationDom.childNodes;

    this.on(this.paginationDom, this.eventType, evt => {
      evt = evt || window.event;
      this.stopPrevent(evt);
      targetDom = evt.srcElement || evt.target;
      for (let i = 0; i < bullets.length; i++) {
        if (targetDom === bullets[i]) {
          index = i;
          break;
        }
      }
      if (this.curIndex === index) return;
      else {
        this.curIndex = index;
        this.play(this.curIndex);
      }
    });
  }
  // 初始化事件
  initEvent(): void {
    const keyboard =
      typeof this.opts.keyboard === 'boolean' ? this.opts.keyboard : true;
    const mousewheel =
      typeof this.opts.mousewheel === 'boolean' ? this.opts.mousewheel : false;

    if (judgePlatform() === 'pc') {
      if (keyboard) {
        this.bindKeyEvent();
      }
      if (mousewheel) {
        this.mousewheel();
      }
      this.mouseHover();
    }
    this.swiperEvent();
  }
  // 绑定键盘事件
  bindKeyEvent(): void {
    this.on(document, 'keydown', evt => {
      evt = evt || window.event;
      const keycode = evt.keyCode;
      if (this.isHorizontal) {
        // ←
        if (keycode === 37) {
          this.prev();
        }
        // →
        else if (keycode === 39) {
          this.next();
        }
      } else {
        // ↑
        if (keycode === 38) {
          this.prev();
        }
        // ↓
        else if (keycode === 40) {
          this.next();
        }
      }
    });
  }
  // 鼠标移入移出事件
  mouseHover(): void {
    this.on(this.bannerWrapper, 'mouseover', () => {
      this.timer && clearInterval(this.timer);
    }).on(this.bannerWrapper, 'mouseout', () => {
      this.timer && this.autoplay();
    });
  }
  // 鼠标滚轮事件
  mousewheel(): void {
    this.on(document, 'mousewheel DOMMouseScroll', evt => {
      evt = evt || window.event;
      let wheelDelta = evt.wheelDelta;
      if (evt.detail) {
        wheelDelta = -evt.detail;
      }
      // 向上滑动滚轮
      if (wheelDelta > 0) {
        this.prev();
      }
      // 向下滑动滚轮
      else if (wheelDelta < 0) {
        this.next();
      }
    });
  }
  // 添加前进后退图标
  arrow(): void {
    const preletrow = createDom('div');
    const nextArrow = createDom('div');

    preletrow.className = 'banner-prev-arrow';
    nextArrow.className = 'banner-next-arrow';
    this.ele.appendChild(preletrow);
    this.ele.appendChild(nextArrow);

    this.on(preletrow, this.eventType, evt => {
      evt = evt || window.event;
      this.stopPrevent(evt);
      this.prev();
    }).on(nextArrow, this.eventType, evt => {
      evt = evt || window.event;
      this.stopPrevent(evt);
      this.next();
    });
  }
  // 获得ie的版本或者edge
  getIeVersion(): string | undefined {
    const ua = navigator.userAgent.toLowerCase();

    if (window.ActiveXObject) {
      if (ua.includes('compatible')) {
        return parseInt(ua.match(/msie ([\d.]+)/)[1]);
      }
    } else if (ua.includes('trident')) {
      return 'edge';
    }
    return undefined;
  }
  // 处理 animation 的情况
  getAnimation(): IOptions['animation'] {
    if (
      (!this.isFlex && this.opts.animation === 'cube') ||
      (this.opts.animation === 'cube' && this.ieVersion !== undefined)
    ) {
      return 'slide';
    }

    return this.opts.animation;
  }

  // 获得item的数量
  getItemsLength(): number {
    return this.items.length;
  }

  // 为元素绑定事件
  on(ele, eventType, callback): Banner {
    const eventList = eventType.split(' ');

    if (typeof callback === 'function') {
      for (const event of eventList) {
        if (document.addEventListener) {
          ele.addEventListener(event, callback);
        } else {
          ele.attachEvent(`on${event}`, callback);
        }
      }
    }

    return this;
  }
  // 设置css样式
  css(...args): Banner {
    const [ele, styles, styleValue] = args;
    let stylePrefixProp = '';

    if (!ele) {
      throw new Error('dom not found!');
    }
    // 处理类似(ele, {position: "absolue", width: "100px"})的情况
    if (styles && typeof styles === 'object') {
      for (const styleProp in styles) {
        stylePrefixProp = getBestStyle(styleProp);
        ele.style[stylePrefixProp] = styles[styleProp];
      }
    }
    // 处理类似(ele, "position", "absolue")的情况
    else if (styles && styleValue && typeof styles === 'string') {
      stylePrefixProp = getBestStyle(styles);
      ele.style[stylePrefixProp] = styleValue;
    }
    return this;
  }
  // 根据type处理节点的class
  dealClass(ele, classStrs, type): Banner {
    classStrs = typeof classStrs === 'string' ? classStrs : '';
    if (classStrs === '') return;

    let eleClass = ele.className;
    const classList = classStrs.split(' ');
    for (const className of classList) {
      if (type === 'addClass') {
        if (!eleClass.includes(className)) {
          eleClass += ' ' + className;
        }
      } else {
        if (eleClass.includes(className)) {
          const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
          eleClass = eleClass.replace(reg, '');
        }
      }
    }
    ele.className = eleClass;
    return this;
  }
}

if (typeof window !== 'undefined') {
  window['Banner'] = Banner;
}

export default Banner;
