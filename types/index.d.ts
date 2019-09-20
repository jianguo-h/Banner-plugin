interface IOptions {
  loop?: boolean;
  speed?: number;
  arrow?: boolean;
  startIndex?: number;
  interval?: number;
  itemSpacing?: number;
  keyboard?: boolean;
  autoplay?: boolean;
  pagination?: boolean;
  mousewheel?: boolean;
  animation?: 'slide' | 'cube' | 'fade';
  direction?: 'horizontal' | 'vertical';
  paginationClickable?: boolean;
  paginationClass?: string;
  paginationActiveClass?: string;
}
