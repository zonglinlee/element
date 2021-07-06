<!--这个组件是全局注册到 vue 上面的  所以 tabs.vue / tab-nav.vue / tab-bar.vue 几个组件都没有引入 -->
<!--ARIA(可访问的富Internet应用程序)定义了一种使残障人士更容易访问Web内容和Web应用程序的方法。-->
<!--hidden属性是HTML5中的新增功能，它告诉浏览器不要显示该元素。 aria-hidden属性告诉屏幕阅读器是否应忽略该元素-->
<!--role 是增强语义性，当现有的HTML标签不能充分表达语义性的时候，就可以借助role来说明。-->
<template>
  <div
    class="el-tab-pane"
    v-if="(!lazy || loaded) || active"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'ElTabPane',

    componentName: 'ElTabPane',

    props: {
      label: String,
      labelContent: Function,
      name: String,
      closable: Boolean,
      disabled: Boolean,
      lazy: Boolean
    },

    data() {
      return {
        index: null,
        loaded: false
      };
    },

    computed: {
      isClosable() {
        return this.closable || this.$parent.closable;
      },
      active() {
        const active = this.$parent.currentName === (this.name || this.index);
        if (active) {
          this.loaded = true;
        }
        return active;
      },
      paneName() {
        return this.name || this.index;
      }
    },

    updated() {
      this.$parent.$emit('tab-nav-update');
    }
  };
</script>
