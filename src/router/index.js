// router/index.js

import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '@/layouts/MainLayout.vue'

// 所有需要布局的页面都作为 DefaultLayout 的子路由
export const constantRoutes = [
  {
    path: '/',
    component: DefaultLayout, // 布局组件
    redirect: '/home',
    meta: { requiresAuth: false },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页', icon: 'home', requiresAuth: false }
      },
      {
        path: 'common',
        name: 'common',
        component: () => import('@/views/common/Index.vue'), // 添加一个父组件
        redirect: '/common/button', // 🔴 改为绝对路径重定向
        meta: { title: '安装组件库样例', icon: 'component', requiresAuth: false },

        children: [
          {
            path: 'button',
            name: 'ButtonDemo',
            component: () => import('@/views/common/demo1.vue'),
            meta: { title: '按钮组件', requiresAuth: false }
          },
          {
            path: 'input',
            name: 'InputDemo',
            component: () => import('@/views/common/demo2.vue'),
            meta: { title: '输入框组件', requiresAuth: false }
          }
        ]
      },
      {
        path: 'component',
        name: 'component',
        component: () => import('@/views/component/Index.vue'), // 添加一个父组件
        redirect: '/component/banners', // 🔴 改为绝对路径重定向
        meta: { title: '本地组件库样例', icon: 'component', requiresAuth: false },
        children: [
          {
            path: 'banners',
            name: 'banners',
            component: () => import('@/views/component/banners.vue'),
            meta: { title: 'banners组件', requiresAuth: false }
          },
          {
            path: 'imgbox',
            name: 'imgbox',
            component: () => import('@/views/component/imgbox.vue'),
            meta: { title: 'imgbox', requiresAuth: false }
          },
          {
            path: 'menus',
            name: 'menus',
            component: () => import('@/views/component/menus.vue'),
            meta: { title: 'menus', requiresAuth: false }
          },
        ]
      },
      {
        path: 'docs',
        name: 'Docs',
        component: () => import('@/views/Docs.vue'),
        meta: { title: '使用文档', icon: 'document', requiresAuth: false }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings.vue'),
        meta: { title: '系统设置', icon: 'setting', requiresAuth: true }
      }
    ]
  }
]

// 独立页面（无布局）
export const independentRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', hideInMenu: true, requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '404', hideInMenu: true, requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...independentRoutes]
})

// 导出菜单用的路由（只取 DefaultLayout 的 children）
export const menuRoutes = constantRoutes[0].children.filter(route => 
  route.meta && !route.meta.hideInMenu
)

export default router