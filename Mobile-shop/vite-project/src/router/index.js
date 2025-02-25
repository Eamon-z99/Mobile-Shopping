import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Shopping from '../views/Shopping.vue'
import My from '../views/My.vue'
import Search from '../views/Search.vue'
import SearchIndex from '../views/search/SearchIndex.vue'
import SearchList from '../views/search/SearchList.vue'
import Sort from '../views/Sort.vue'
import Detail from '../views/detail.vue'
import Login from '../views/login/login.vue'
import resetpassword from '../views/login/resetpassword.vue'
import register from '../views/login/register.vue'
import order from '../views/order.vue'
const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/my',
    name: 'my',
    component: My,
  },
  {
    path: '/shopping',
    name: 'shopping',
    component: Shopping,
  },
  {
    path: '/search',
    name: 'Search',
    redirect:{name:'index'},
    children: [{
        path: '/index',
        name: 'index',
        component: SearchIndex,
      },
      {
        path: 'list',
        name: 'list',
        component: SearchList,
      }
    ],
    component: Search,
  },
  {
    path: '/sort',
    name: 'sort',
    component: Sort,
  },
  {
    path: '/detail',
    name: 'detail',
    component: Detail,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/resetpassword',
    name: 'resetpassword',
    component: resetpassword,
  },
  {
    path: '/register',
    name: 'register',
    component: register,
  },
  {
    path: '/order',
    name: 'order',
    component: order,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router