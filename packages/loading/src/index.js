import Vue from 'vue';
import loadingVue from './loading.vue';
import { addClass, removeClass, getStyle } from 'element-ui/src/utils/dom';
import { PopupManager } from 'element-ui/src/utils/popup';
import afterLeave from 'element-ui/src/utils/after-leave';
import merge from 'element-ui/src/utils/merge';

// 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。data 选项是特例，需要注意 - 在 Vue.extend() 中它必须是函数
// 继承 loadingVue 组件
const LoadingConstructor = Vue.extend(loadingVue);

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  customClass: ''
};

let fullscreenLoading;

LoadingConstructor.prototype.originalPosition = '';
LoadingConstructor.prototype.originalOverflow = '';

LoadingConstructor.prototype.close = function() {
  if (this.fullscreen) {
    // fullscreenLoading 是一个 Loading 实例，在关闭的时候取消掉
    fullscreenLoading = undefined;
  }
  afterLeave(this, _ => {
    const target = this.fullscreen || this.body
      ? document.body
      : this.target;
    removeClass(target, 'el-loading-parent--relative');
    removeClass(target, 'el-loading-parent--hidden');
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.$destroy();
  }, 300);
  this.visible = false;
};

const addStyle = (options, parent, instance) => {
  let maskStyle = {};
  if (options.fullscreen) {
    instance.originalPosition = getStyle(document.body, 'position');
    instance.originalOverflow = getStyle(document.body, 'overflow');
    maskStyle.zIndex = PopupManager.nextZIndex();
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position');
    ['top', 'left'].forEach(property => {
      let scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
      maskStyle[property] = options.target.getBoundingClientRect()[property] +
        document.body[scroll] +
        document.documentElement[scroll] +
        'px';
    });
    ['height', 'width'].forEach(property => {
      maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
    });
  } else {
    instance.originalPosition = getStyle(parent, 'position');
  }
  Object.keys(maskStyle).forEach(property => {
    instance.$el.style[property] = maskStyle[property];
  });
};

const Loading = (options = {}) => {
  if (Vue.prototype.$isServer) return;
  options = merge({}, defaults, options);
  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target);
  }
  options.target = options.target || document.body;
  if (options.target !== document.body) {
    options.fullscreen = false;
  } else {
    options.body = true;
  }
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading;
  }

  let parent = options.body ? document.body : options.target;
  // el选项：string | Element，限制：只在用 new 创建实例时生效。
  // 提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。可以是 CSS 选择器，也可以是一个 HTMLElement 实例。
  // 如果在实例化时存在这个选项，实例将立即进入编译过程，否则，需要显式调用 vm.$mount() 手动开启编译。
  let instance = new LoadingConstructor({ // 初始化一个Loading实例
    el: document.createElement('div'),
    data: options
  });

  addStyle(options, parent, instance);
  if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
    addClass(parent, 'el-loading-parent--relative');
  }
  if (options.fullscreen && options.lock) {
    addClass(parent, 'el-loading-parent--hidden');
  }
  // $el,类型Element, Vue 实例使用的根 DOM 元素。
  parent.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true;
  });
  if (options.fullscreen) {
    fullscreenLoading = instance;
  }
  return instance;
};

export default Loading;
