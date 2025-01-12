import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        component: () => import('pages/IndexPage.vue'),
        path: '',
      },
    ],
    component: () => import('layouts/MainLayout.vue'),
    path: '/',
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    component: () => import('pages/ErrorNotFound.vue'),
    path: '/:catchAll(.*)*',
  },
]

export default routes
