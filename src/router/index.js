import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Route from '../views/Route.vue'
import Stop from '../views/Stop.vue'
import Checkpoint from '../views/Checkpoint.vue'
import Bus from '../views/Bus.vue'
import Report from '../views/Report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/monitor', name: 'monitor', component: Home },
  { path: '/route', name: 'route', component: Route },
  { path: '/stop', name: 'stop', component: Stop },
  { path: '/checkpoint', name: 'checkpoint', component: Checkpoint },
  { path: '/bus', name: 'bus', component: Bus },
  { path: '/report', name: 'report', component: Report },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
