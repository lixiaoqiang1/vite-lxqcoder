<template>
  <el-container class="main-container">
    <!-- 侧边栏组件 -->
    <Sidebar
      :menu-routes="menuRoutes"
      :collapsed="sidebarCollapsed"
      @select="handleMenuSelect"
      @toggle-collapse="toggleSidebar"
    />

    <!-- 主内容区 -->
    <el-container>
      <!-- 头部组件 -->
      <Header
        :title="pageTitle"
        @search="handleSearch"
        @notify-click="handleNotify"
        @user-command="handleUserCommand"
      />
      
      <!-- 主体内容 -->
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="keepAliveRoutes">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>

      <!-- 页脚 -->
      <el-footer class="main-footer" v-if="showFooter">
        <div class="footer-content">
          <span>© 2024 ByteCoder UI</span>
          <div class="footer-links">
            <a href="#" @click.prevent="goToDocs">使用文档</a>
            <a href="#" @click.prevent="goToGithub">GitHub</a>
            <a href="#" @click.prevent="goToFeedback">反馈建议</a>
          </div>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { menuRoutes as routesConfig } from '@/router/index'

const route = useRoute()
const router = useRouter()

// 响应式数据
const sidebarCollapsed = ref(false)
const showFooter = ref(true)
const menuRoutes = ref(routesConfig)

// 需要缓存的页面路由名称
// MainLayout.vue 中的 keepAliveRoutes 计算属性需要调整
const keepAliveRoutes = computed(() => {
  // 扁平化所有路由（包括子路由）
  const flattenRoutes = (routes) => {
    return routes.flatMap(route => {
      const result = [route.name]
      if (route.children?.length) {
        result.push(...flattenRoutes(route.children))
      }
      return result
    })
  }
  
  return flattenRoutes(menuRoutes.value).filter(name => name)
})

// 计算页面标题
const pageTitle = computed(() => {
  return route.meta?.title || 'ByteCoder UI'
})

// 处理菜单选择
const handleMenuSelect = (path) => {
  router.push(path)
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 搜索处理
const handleSearch = () => {
  // 这里可以打开搜索弹窗
  console.log('打开搜索')
}

// 通知处理
const handleNotify = (notify) => {
  console.log('通知点击:', notify)
}

// 用户命令处理
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
        router.push('/Login')
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  // 退出登录逻辑
  console.log('退出登录')
  router.push('/login')
}

// 页脚链接处理
const goToDocs = () => {
  router.push('/docs')
}

const goToGithub = () => {
  window.open('https://github.com', '_blank')
}

const goToFeedback = () => {
  window.open('mailto:feedback@bytecoder.com', '_blank')
}

// 初始化
onMounted(() => {
  // 这里可以根据窗口大小自动折叠侧边栏
  const handleResize = () => {
    if (window.innerWidth < 768) {
      sidebarCollapsed.value = true
    }
  }
  
  handleResize()
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.main-container {
  height: 100vh;
  overflow: hidden;
}

/* 主体内容区域 */
.main-content {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
  min-height: calc(100vh - 120px);
}

/* 页脚样式 */
.main-footer {
  background: #fff;
  border-top: 1px solid #e8e8e8;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  color: #666;
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #667eea;
}

/* 页面切换动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>