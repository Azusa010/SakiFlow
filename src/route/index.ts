import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { title: '注册' },
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: '仪表盘',requiresAuth: true },
        },

        {
          path: 'chat',
          name: 'Chat',
          component: () => import('@/views/Chat.vue'),
          meta: { title: 'AI聊天' ,requiresAuth: true},
        },
        {
          path: 'editor',
          name: 'Editor',
          component: () => import('@/views/Editor.vue'),
          meta: { title: '编辑器',requiresAuth: true },
        },
        {
          path: 'files',
          name: 'Files',
          component: () => import('@/views/Files.vue'),
          meta: { title: '文件中心',requiresAuth: true },
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/Settings.vue'),
          meta: { title: '设置',requiresAuth: true },
        },
        {
          path: 'statistics',
          name: 'Statistics',
          component: () => import('@/views/Statistics.vue'),
          meta: { title: '统计',requiresAuth: true }
        },
        {
          path: 'workflow',
          name: 'Workflow',
          component: () => import('@/views/Workflow.vue'),
          meta: { title: '工作流',requiresAuth: true }
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    }
  ],
})


router.beforeEach((to)=>{
  const userStore = useUserStore()
  if(to.meta.requiresAuth && !userStore.isLoggedIn){
    return {name: 'Login'}
  }

  if(
    (to.name === 'Login' || to.name === 'Register') && userStore.isLoggedIn
  ){
    return {name: 'Dashboard'}
  }
  return true
})

export default router
