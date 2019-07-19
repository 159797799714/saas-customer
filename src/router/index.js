import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
// 控制中心
const page404 = resolve => require(['@/views/404'], resolve)
const index = resolve => require(['@/views/index'], resolve)
const login = resolve => require(['@/views/login/index'], resolve)
const register = resolve => require(['@/views/login/register'], resolve)
const forget = resolve => require(['@/views/login/forget'], resolve)
const myApp = resolve => require(['@/views/index/myApp'], resolve)
const mine = resolve => require(['@/views/index/mine'], resolve)
const stayPay = resolve => require(['@/views/index/stayPay'], resolve)
const order = resolve => require(['@/views/index/mine/order'], resolve)
const journal = resolve => require(['@/views/index/mine/journal'], resolve)
const personal = resolve => require(['@/views/index/mine/personal'], resolve)
const appKeep = resolve => require(['@/views/index/mine/appKeep'], resolve)
const changeInfo = resolve => require(['@/views/index/mine/components/changeInfo'], resolve)

export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: login,
    hidden: true
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/forget',
    name: 'forget',
    component: forget
  },
  {
    path: '/404',
    component: 404,
    hidden: true
  },
  {
    path: '/',
    redirect: '/index',
    hidden: true
  },
  {
    path: '/index',
    name: 'index',
    component: index,
    redirect: '/index/myApp',
    children: [
      {
        path: 'myApp',
        name: 'myApp',
        component: myApp
      }, {
        path: 'mine',
        name: 'mine',
        component: mine,
        redirect: 'mine/appKeep'
      }, {
        path: 'stayPay',
        name: 'stayPay',
        component: stayPay
      }, {
        path: 'order',
        name: 'order',
        component: order
      }, {
        path: 'journal',
        name: 'journal',
        component: journal
      }, {
        path: 'personal',
        name: 'personal',
        component: personal
      }, {
        path: 'appKeep',
        name: 'appKeep',
        component: appKeep
      }, {
        path: 'changeInfo',
        name: 'changeInfo',
        component: changeInfo
      }
    ]
  },

  { path: '*', redirect: '/404', component: page404, hidden: true }
]
export default new Router({
  mode: 'history',
  // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
