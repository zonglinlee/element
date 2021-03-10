<!--
1.此组件会将 实例本身this 作为一个共用数据 通过 provide 传递给子组件共用
2.data 中保存了 panes [] 数组对象，用来保存 单个的 tab 实例
3.jsx 支持返回数组对象（line176） { tabPosition !== 'bottom' ? [header, panels] : [panels, header] }
-->
<script>
  import TabNav from './tab-nav';

  export default {
    name: 'ElTabs',

    components: {
      TabNav
    },

    props: {
      type: String,
      activeName: String,
      closable: Boolean,
      addable: Boolean,
      value: {},
      editable: Boolean,
      tabPosition: {
        type: String,
        default: 'top'
      },
      beforeLeave: Function,
      stretch: Boolean
    },

    provide() {
      return {
        rootTabs: this
      };
    },

    data() {
      return {
        currentName: this.value || this.activeName,
        panes: []
      };
    },

    watch: {
      activeName(value) {
        this.setCurrentName(value);
      },
      value(value) {
        this.setCurrentName(value);
      },
      currentName(value) {
        if (this.$refs.nav) {
          this.$nextTick(() => {
            this.$refs.nav.$nextTick(_ => {
              this.$refs.nav.scrollToActiveTab();
            });
          });
        }
      }
    },

    methods: {
      // 这个函数用来动态更新 tab-pane 组件，分别再tab组件 创建/挂载/更新 的时候调用
      calcPaneInstances(isForceUpdate = false) {
        console.log('this.$slots.default:', this.$slots.default); // [VNode, VNode] 输出一个 VNode数组
        if (this.$slots.default) {
          // 筛选出 插槽中 ElTabPane 组件
          // vnode.componentOptions.Ctor 对应的就是子组件的构造函数
          // componentOptions 可以通过 vnode.componentOptions 来访问，用来挂载部分组件选项来使用的。包括
          // { Ctor, tag, propsData, listeners，children } 。非组件的componentOptions为空
          const paneSlots = this.$slots.default.filter(vnode => vnode.tag &&
            vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'ElTabPane');
          // update indeed（ 提取ElTabPane组件实例 ）
          const panes = paneSlots.map(({ componentInstance }) => componentInstance);
          // 更新 tab-pane 实例
          const panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]));
          if (isForceUpdate || panesChanged) {
            this.panes = panes;
          }
        } else if (this.panes.length !== 0) {
          this.panes = [];
        }
      },
      // 触发 tab 切换和点击事件
      handleTabClick(tab, tabName, event) {
        console.log(arguments);
        if (tab.disabled) return;
        this.setCurrentName(tabName);
        this.$emit('tab-click', tab, event);
      },
      handleTabRemove(pane, ev) {
        if (pane.disabled) return;
        ev.stopPropagation();
        this.$emit('edit', pane.name, 'remove');
        this.$emit('tab-remove', pane.name);
      },
      handleTabAdd() {
        this.$emit('edit', null, 'add');
        this.$emit('tab-add');
      },
      setCurrentName(value) {
        // 这里的input事件是用来触发 tab组件上 v-model 的绑定的，用来设置当前 tab 标签的 name
        const changeCurrentName = () => {
          this.currentName = value;
          this.$emit('input', value);
        };
        // beforeLeave:切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换
        if (this.currentName !== value && this.beforeLeave) {
          const before = this.beforeLeave(value, this.currentName);
          if (before && before.then) {
            before
              .then(() => {
                changeCurrentName();
                this.$refs.nav && this.$refs.nav.removeFocus();
              }, () => {
                // https://github.com/ElemeFE/element/pull/14816
                // ignore promise rejection in `before-leave` hook
              });
          } else if (before !== false) {
            changeCurrentName();
          }
        } else {
          changeCurrentName();
        }
      }
    },

    render(h) {
      let {
        type,
        handleTabClick,
        handleTabRemove,
        handleTabAdd,
        currentName,
        panes,
        editable,
        addable,
        tabPosition,
        stretch
      } = this;
      // 如果 editable 或者 addable 为true 则显示 新增tab 按钮，否则不显示
      const newButton = editable || addable
        ? (
          <span
            class="el-tabs__new-tab"
            on-click={ handleTabAdd }
            tabindex="0"
            on-keydown={ (ev) => { if (ev.keyCode === 13) { handleTabAdd(); }} }
          >
            <i class="el-icon-plus"></i>
          </span>
        )
        : null;

      const navData = {
        props: {
          currentName,
          onTabClick: handleTabClick,
          onTabRemove: handleTabRemove,
          editable,
          type,
          panes,
          stretch
        },
        ref: 'nav'
      };
      const header = (
        <div class={['el-tabs__header', `is-${tabPosition}`]}>
          {newButton}
          <tab-nav { ...navData }></tab-nav>
        </div>
      );
      const panels = (
        <div class="el-tabs__content">
          {this.$slots.default}
        </div>
      );

      return (
        <div class={{
          'el-tabs': true,
          'el-tabs--card': type === 'card',
          [`el-tabs--${tabPosition}`]: true,
          'el-tabs--border-card': type === 'border-card'
        }}>
          { tabPosition !== 'bottom' ? [header, panels] : [panels, header] }
        </div>
      );
    },

    created() {
      if (!this.currentName) {
        this.setCurrentName('0');
      }

      this.$on('tab-nav-update', this.calcPaneInstances.bind(null, true));
    },

    mounted() {
      this.calcPaneInstances();
    },

    updated() {
      this.calcPaneInstances();
    }
  };
</script>
