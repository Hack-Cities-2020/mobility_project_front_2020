import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Itinerary from '../views/Itinerary.vue'
import Checkpoint from '../views/Checkpoint.vue'
import Bus from '../views/Bus.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/itinerary', name: 'itinerary', component: Itinerary },
  { path: '/checkpoint', name: 'checkpoint', component: Checkpoint },
  { path: '/bus', name: 'bus', component: Bus },
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
