<template>
  <el-header class="header">
    <div class="header-left">
      <slot name="left">
        <h3 class="page-title">{{ title }}</h3>
      </slot>
    </div>
    
    <div class="header-center">
      <slot name="center">
        <el-breadcrumb class="breadcrumb" separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-breadcrumb-item>
          <template v-if="breadcrumbs.length > 0">
            <el-breadcrumb-item 
              v-for="item in breadcrumbs" 
              :key="item.path"
              :to="item.path !== '#' ? { path: item.path } : undefined"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>
      </slot>
    </div>
    
    <div class="header-right">
      <slot name="right">
        <div class="user-actions">
          <!-- 搜索按钮 -->
          <el-button 
            type="text" 
            class="action-btn"
            @click="handleSearch"
          >
            <el-icon><Search /></el-icon>
          </el-button>
          
          <!-- 通知 -->
          <el-dropdown 
            @command="handleNotifyCommand"
            trigger="click"
          >
            <div class="action-btn notify-btn">
              <el-icon><Bell /></el-icon>
              <el-badge 
                v-if="unreadCount > 0" 
                :value="unreadCount" 
                class="badge" 
              />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="item in notifications" 
                  :key="item.id"
                  :command="item.id"
                  class="notify-item"
                >
                  <div class="notify-content">
                    <div class="notify-title">{{ item.title }}</div>
                    <div class="notify-time">{{ item.time }}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <div class="notify-footer" @click="viewAllNotifications">
                    查看所有通知
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <!-- 用户信息 -->
          <el-dropdown 
            @command="handleUserCommand"
            trigger="click"
          >
            <div class="user-info">
              <el-avatar 
                size="small"
                :src="user.avatar"
                class="user-avatar"
              >
                {{ user.name.charAt(0) }}
              </el-avatar>
              <span class="user-name">{{ user.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  <span>设置</span>
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </slot>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  Search,
  Bell,
  User,
  Setting,
  SwitchButton,
  ArrowDown
} from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: 'ByteCoder UI'
  },
  user: {
    type: Object,
    default: () => ({
      name: '管理员',
      avatar: ''
    })
  }
})

const emit = defineEmits([
  'search', 
  'notify-click', 
  'user-command',
  'toggle-sidebar'
])

const route = useRoute()

// 模拟通知数据
const notifications = ref([
  { id: 1, title: '新版本发布', time: '2小时前', read: false },
  { id: 2, title: '系统维护通知', time: '1天前', read: false },
  { id: 3, title: '欢迎使用系统', time: '3天前', read: true }
])

// 计算属性
const breadcrumbs = computed(() => {
  const matched = route.matched.slice(1)
  return matched.map(item => ({
    path: item.path,
    title: item.meta?.title || item.name
  }))
})

const unreadCount = computed(() => {
  return notifications.value.filter(item => !item.read).length
})

// 方法
const handleSearch = () => {
  emit('search')
}

const handleNotifyCommand = (id) => {
  const notify = notifications.value.find(item => item.id === id)
  if (notify) {
    notify.read = true
    emit('notify-click', notify)
  }
}

const handleUserCommand = (command) => {
  emit('user-command', command)
}

const viewAllNotifications = () => {
  // 查看所有通知的逻辑
  emit('notify-click', { type: 'all' })
}
</script>

<style scoped>
.header {
  background: linear-gradient(90deg, #fff 0%, #f8f9fa 100%);
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 60px;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1;
}

/* 面包屑样式 */
.breadcrumb {
  margin-left: 20px;
}

:deep(.el-breadcrumb__inner) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #667eea;
  font-weight: 500;
}

/* 用户操作区域 */
.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.action-btn:hover {
  background-color: rgba(102, 126, 234, 0.1);
}

.action-btn .el-icon {
  font-size: 18px;
  color: #666;
}

.action-btn:hover .el-icon {
  color: #667eea;
}

/* 通知按钮 */
.notify-btn {
  position: relative;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.user-info:hover {
  background-color: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.2);
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.user-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.user-info .el-icon {
  font-size: 12px;
  color: #999;
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu) {
  border: 1px solid #e8e8e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
  color: #666;
}

/* 通知项样式 */
.notify-item {
  min-width: 280px;
}

.notify-content {
  flex: 1;
}

.notify-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.notify-time {
  font-size: 12px;
  color: #999;
}

.notify-footer {
  text-align: center;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
}

.notify-footer:hover {
  color: #764ba2;
}
</style>