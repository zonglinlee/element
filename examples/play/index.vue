<template>
  <div>

    <el-menu
        :default-active="activeIndex2" style="margin-bottom: 40px"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    </el-tabs>
    <el-image class="image-slot" :src="src">
    </el-image>
    <el-date-picker
        v-model="value1"
        type="date"
        placeholder="选择日期">
    </el-date-picker>
    <div ref="divTest" @click="handleClick" style="width: 2rem;height: 2rem;border: solid 1px;">testClick</div>
    <test-bus></test-bus>
    <test-vnode></test-vnode>
  </div>
</template>

<script>
import Bus from "/examples/bus"
import TestBus from "./test/testBus";
import TestVnode from "./test/TestVnode";

export default {
  components: {TestVnode, TestBus},
  data() {
    return {
      textarea: "test",
      activeIndex: '1',
      activeIndex2: '1',
      activeName: 'second',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      editableTabsValue: '2',
      editableTabs: [{
        title: 'Tab 1很长的title',
        name: '1'
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content'
      }],
      tabIndex: 2,
      value1: '',
      clickEvent: null
    }

  },
  mounted() {
    this.clickEvent = new MouseEvent("click")
    setInterval(this.testCustomEvent, 1000)
    Bus.$on('emitGlobalEvent', val => {
      this.$message.info(val)
    })
  }
  ,
  methods: {
    handleClick(event) {
      event.target.classList.toggle('bg-orange')
    },
    testCustomEvent() {
      this.$refs.divTest && this.$refs.divTest.dispatchEvent(this.clickEvent)
    },

    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }

  }
}
</script>

<style lang="scss" scoped>
> > > .el-image {
  width: 100px;
  height: 100px;
}

.image-slot {
  width: 100px;
  height: 100px;
}

.bg-orange {
  background: #ffab49;
}
</style>
