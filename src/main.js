import Vue from 'vue'

// import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import { Button, Dialog, Table, Input, Form, FormItem, Checkbox } from 'element-ui'

import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n中文
import qs from 'qs'
import '@/styles/index.scss' // global
import '@/assets/icon/iconfont.css' // 全局自定义icon

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import { link } from '@/utils/service.js'
import envDev from './.env.devs.js'
import envPro from './.env.pros.js'
// console.log(123, envDev.BASE_URL, envPro.BASE_URL)
let envs = process.env.NODE_ENV
if (envs === 'development') {
  store.state.httpUrl = envDev.BASE_URL
  // console.log(envDev.BASE_URL, store.state.httpUrl)
  // console.log(store.state.httpUrl)
} else {
  store.state.httpUrl = envPro.BASE_URL
  // console.log(envPro.BASE_URL, store.state.httpUrl)
  // console.log(store.state.httpUrl)
}
Vue.use(ElementUI, { locale })
// Vue.use({ locale })
Vue.prototype.$qs = qs
Vue.prototype.$link = link
var vm = new Vue()
Vue.prototype.$center = vm

Vue.config.productionTip = false

let Vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Vue.use({
  Vm
})
