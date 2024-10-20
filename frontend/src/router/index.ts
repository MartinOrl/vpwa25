import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  const authStore = useAuthStore()
  authStore.$subscribe(() => {
    if (
      !authStore.isLoggedIn &&
      !Router.currentRoute.value.path.startsWith('/auth')
    ) {
      Router.push('/auth/login')
    }
  })

  Router.beforeEach((to, _, next) => {
    if (!authStore.loadUser() && !to.path.startsWith('/auth')) {
      next('/auth/login')
    } else if (to.path === '/' || to.path === '/auth') {
      next('/chat')
    } else {
      next()
    }
  })

  return Router
})
