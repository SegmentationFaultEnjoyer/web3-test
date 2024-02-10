import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.balance },
  },
  {
    path: '/balance',
    name: ROUTE_NAMES.balance,
    component: () => import('@/pages/BalancePage.vue'),
  },
  {
    path: '/tx-list',
    name: ROUTE_NAMES.txList,
    component: () => import('@/pages/TxListPage.vue'),
  },
  {
    path: '/send-tx',
    name: ROUTE_NAMES.sendTx,
    component: () => import('@/pages/SendTxPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
