<!-- src/components/菜单.vue -->
<template>
  <el-aside width="200px">
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      @select="handleMenuSelect" background-color="#545c64" text-color="#fff" active-text-color="#CDC9C9">
      <!-- 使用计算属性 menuWithChildren -->
      <el-sub-menu v-for="item in menuWithChildren" :key="item.index" :index="item.index">
        <template #title>
          <el-icon>
            <component :is="IconMenu" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index">
          <el-icon>
            <component :is="Location" />
          </el-icon>
          <span>{{ child.title }}</span>
        </el-menu-item>
      </el-sub-menu>
      <!-- 使用计算属性 menuWithoutChildren -->
      <el-menu-item v-for="item in menuWithoutChildren" :key="item.index" :index="item.index">
        <el-icon>
          <component :is="IconMenu" />
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue';
import menuConfig from '../config/menuConfig';

const activeMenu = ref('1-1'); // 默认选中第一个子菜单
const emits = defineEmits(['menu-select']);

// 计算属性：过滤有子菜单且有效的项
const menuWithChildren = computed(() => menuConfig.filter(item => item && item.children));

// 计算属性：过滤没有子菜单且有效的项
const menuWithoutChildren = computed(() => menuConfig.filter(item => item && !item.children));

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleMenuSelect = (key) => {
  emits('menu-select', key);
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
}
</style>