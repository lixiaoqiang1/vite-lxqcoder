<template>
  <el-aside :width="collapsed ? '64px' : '200px'" class="sidebar">
    <!-- Logo -->
    <div class="logo" @click="goHome">
      <div class="logo-icon">
        <span v-if="collapsed">BU</span>
        <el-icon v-else><Setting /></el-icon>
      </div>
      <h2 v-show="!collapsed">ByteCoder UI</h2>
    </div>

    <!-- Menu -->
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="collapsed"
      :collapse-transition="false"
      :unique-opened="true"
      @select="handleMenuSelect"
      router
    >
      <template v-for="item in menuRoutes" :key="item.path">
        <!-- With children -->
        <el-sub-menu v-if="item.children?.length" :index="item.name">
          <template #title>
            <el-icon v-if="getIcon(item.meta?.icon)">
              <component :is="getIcon(item.meta?.icon)" />
            </el-icon>
            <span>{{ item.meta?.title || item.name }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.name"
            class="submenu-item"
          >
            {{ child.meta?.title || child.name }}
          </el-menu-item>
        </el-sub-menu>
        
        <!-- Single item -->
        <el-menu-item v-else :index="item.name">
          <el-icon v-if="getIcon(item.meta?.icon)">
            <component :is="getIcon(item.meta?.icon)" />
          </el-icon>
          <template #title>{{ item.meta?.title || item.name }}</template>
        </el-menu-item>
      </template>
    </el-menu>

    <!-- Collapse button -->
    <div class="collapse-btn" @click="toggleCollapse">
      <el-icon>
        <component :is="collapsed ? Expand : Fold" />
      </el-icon>
      <span v-show="!collapsed">收起菜单</span>
    </div>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router' // 添加 useRouter
import { 
  HomeFilled,
  Menu,
  Document,
  InfoFilled,
  Setting,
  Expand,
  Fold
} from '@element-plus/icons-vue'

const props = defineProps({
  menuRoutes: {
    type: Array,
    default: () => []
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'toggle-collapse'])
const route = useRoute()
const router = useRouter() // 添加 router

const activeMenu = computed(() => route.name) // 🔴 改为使用 route.name 而不是 path
console.log('activeMenu',activeMenu)

const getIcon = (iconName) => {
  const icons = {
    'home': HomeFilled,
    'component': Menu,
    'document': Document,
    'info': InfoFilled,
    'setting': Setting
  }
  return icons[iconName]
}

const handleMenuSelect = (name) => {
  // 🔴 通过路由名称跳转，避免路径拼接问题
  router.push({ name: name })
}

const toggleCollapse = () => emit('toggle-collapse')

// 🔴 添加首页跳转函数
const goHome = () => {
  router.push({ name: 'Home' })
}
</script>
<style scoped>
.sidebar {
  background: #1a252f;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
  position: relative;
}

/* Logo */
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.logo-icon span {
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

/* Menu */
.sidebar-menu {
  flex: 1;
  border-right: none;
  background: transparent !important;
}

:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.8) !important;
  margin: 2px 8px;
  border-radius: 6px;
}

:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #2340c3 0%, #764ba2 100%) !important;
  color: #fff !important;
}

:deep(.el-icon) {
  margin-right: 12px;
}

/* Submenu items - dark background */
:deep(.el-menu--inline) {
  background: #1c2833 !important;
}

:deep(.el-menu--inline .el-menu-item) {
  background: #1c2833 !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.el-menu--inline .el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}

:deep(.el-menu--inline .el-menu-item.is-active) {
  background: #2c3e50 !important;
  color: #fff !important;
}

/* Collapse button */
.collapse-btn {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0 16px;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.collapse-btn .el-icon {
  margin-right: 8px;
}

/* Collapsed state */
:deep(.el-menu--collapse) {
  width: 64px;
}

:deep(.el-menu--collapse .el-icon) {
  margin-right: 0;
}
</style>