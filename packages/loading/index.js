// 两种调用方式调用Loading组件：指令方式/服务方式
import directive from './src/directive';
import service from './src/index';

export default {
  install(Vue) {
    Vue.use(directive);
    Vue.prototype.$loading = service;
  },
  directive,
  service
};
