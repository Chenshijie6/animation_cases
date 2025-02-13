<!-- src/App.vue -->
<template>
  <el-container>
    <Sidebar @menu-select="handleMenuSelect" />
    <el-container>
      <el-main style="width: calc(100vw - 201px);height:99.5vh;padding: 0;">
        <component :is="currentComponent" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import Sidebar from './components/菜单.vue';
import Component1 from './components/页面/canvas案例/电子蜘蛛.vue';
import Component2 from './components/页面/canvas案例/烟花.vue';
import Component3 from './components/页面/canvas案例/粒子特效.vue';
import Component4 from './components/页面/canvas案例/星空.vue';
import Component5 from './components/页面/canvas案例/彩色大树.vue';
import Component6 from './components/页面/canvas案例/星空夜景.vue';
import Component7 from './components/页面/canvas案例/测试页.vue';
import Component8 from './components/页面/css案例/月光沙漠.vue';

import menuConfig from './config/menuConfig';

const components = {
  Component1,
  Component2,
  Component3,
  Component4,
  Component5,
  Component6,
  Component7,
  Component8
};

const currentComponent = shallowRef(Component6);

const handleMenuSelect = (key) => {
  const selectedParentComponent = menuConfig.find(item => item.index === key);

  if (selectedParentComponent && selectedParentComponent.component) {
    currentComponent.value = components[selectedParentComponent.component];
  }

  const selectedChildComponent = menuConfig
    .flatMap(item => item.children)
    .find(child => child.index === key);

  if (selectedChildComponent) {
    currentComponent.value = components[selectedChildComponent.component];
    return;
  }


};
</script>

<style scoped>
.el-main {
  /* background-color: #000;
  color: #333; */
}
</style>