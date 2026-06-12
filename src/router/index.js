import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/calendar'
      },
      {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('@/views/calendar/index.vue'),
        meta: { title: '值班日历' }
      },
      {
        path: '/arrangement',
        name: 'Arrangement',
        component: () => import('@/views/arrangement/index.vue'),
        meta: { title: '值班安排表' }
      },
      {
        path: '/arrangement/add',
        name: 'AddDuty',
        component: () => import('@/views/arrangement/add.vue'),
        meta: { title: '新增值班' }
      },
      {
        path: '/arrangement/import',
        name: 'ImportDuty',
        component: () => import('@/views/arrangement/import.vue'),
        meta: { title: '导入值班表' }
      },
      {
        path: '/member',
        name: 'Member',
        component: () => import('@/views/member/index.vue'),
        meta: { title: '值班成员' }
      },
      {
        path: '/member/add',
        name: 'AddMember',
        component: () => import('@/views/member/add.vue'),
        meta: { title: '新增辅导员' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router