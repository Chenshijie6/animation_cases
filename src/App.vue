<!-- src/App.vue -->
<template>
  <el-container>
    <Sidebar @menu-select="handleMenuSelect" />
    <el-container>
      <el-header style="padding: 20px;height:10px;z-index: 100000;font-size: 20px;background-color: rgb(84,92,100);">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index" >
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main style="width: calc(100vw - 201px);height: calc(99.5vh - 61px);padding: 0;">
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
import Component9 from './components/页面/css案例/时光隧道穿梭.vue';
import Component10 from './components/页面/canvas案例/类星体探险家.vue';

import menuConfig from './config/menuConfig';

const components = {
  Component1,
  Component2,
  Component3,
  Component4,
  Component5,
  Component6,
  Component7,
  Component8,
  Component9,
  Component10
};

const currentComponent = shallowRef(Component6);
const breadcrumbItems = ref([]);
const handleMenuSelect = (key) => {
  let parentMenu = null;
  let childMenu = null;

  // 查找父级菜单
  parentMenu = menuConfig.find(item => {
    if (item.index === key) return true;
    childMenu = item.children?.find(child => child.index === key);
    return !!childMenu;
  });

  // 更新面包屑路径
  breadcrumbItems.value = [];
  if (parentMenu) {
    breadcrumbItems.value.push(parentMenu.title);
    if (childMenu) {
      breadcrumbItems.value.push(childMenu.title);
    }
  }
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
:deep(.el-breadcrumb__inner){
  color:white
}
</style>