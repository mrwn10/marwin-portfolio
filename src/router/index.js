import { createRouter, createWebHistory } from 'vue-router'
import BootScreen from '../views/BootScreen.vue'
import LockScreen from '../views/LockScreen.vue'
import WindowsRestart from '../views/WindowsRestart.vue'
import DesktopScreen from '../views/DesktopScreen.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: BootScreen
  },
  {
    path: '/lock',
    name: 'lock',
    component: LockScreen
  },
  {
    path: '/restart',
    name: 'restart',
    component: WindowsRestart
  },
  {
    path: '/desktop',
    name: 'desktop',
    component: DesktopScreen
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router