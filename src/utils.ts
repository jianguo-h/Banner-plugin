// 创建dom
export function createDom(tagName: string = 'div'): HTMLElement {
  return document.createElement(tagName);
}

// 判断平台(pc or mobile)
export function judgePlatform(): 'mobile' | 'pc' {
  const userAgent = navigator.userAgent.toLowerCase();
  const agents: string[] = [
    'android',
    'iphone',
    'symbianos',
    'windows phone',
    'ipad',
    'ipod'
  ];
  for (const agent of agents) {
    if (userAgent.includes(agent)) {
      return 'mobile';
    }
  }
  return 'pc';
}

// 返回适合当前浏览器版本的css属性，否则返回false
export function getBestStyle(prop): string | boolean {
  const style = createDom('dummy').style;
  const prefixes = ['webkit', 'moz', 'o', 'ms'];
  let prefixeProp = '';

  if (style[prop] !== undefined) return prop;

  prop = prop.charAt(0).toUpperCase() + prop.substr(1);
  for (const prefix of prefixes) {
    prefixeProp = prefix + prop;
    if (style[prefixeProp] !== undefined) {
      return prefixeProp;
    }
  }
  return false;
}

// 判断是否支持flex
export function isSupportFlex(): boolean {
  if (getBestStyle('box') || getBestStyle('flex') || getBestStyle('flexbox')) {
    return true;
  }
  return false;
}
