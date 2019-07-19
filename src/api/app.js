import request from '@/utils/request'

// 应用列表
export function getAppLists (data) {
  return request({
    url: '/app/app/lists',
    method: 'get',
    data: data
  })
}

// 应用模块选项列表
export function gatAppModuleLists (data) {
  return request({
    url: '/app/module/items',
    method: 'get',
    data: data
  })
}

// 应用开通的模块列表
export function appLists (data) {
  return request({
    url: '/app/module/lists',
    method: 'get',
    data: data
  })
}

// 创建应用
export function createApp (data) {
  return request({
    url: '/app/app/create',
    method: 'post',
    data: data
  })
}

// 应用价格套餐列表
export function appPriceList (id) {
  return request({
    url: '/app/order/goods',
    method: 'post',
    data: {
      tenant_id: id
    }
  })
}

// 登录日志
export function getloginLog (data) {
  return request({
    url: '/customer/customer/login_log',
    method: 'get',
    params: data
  })
}

// 个人资料
export function getProfile (data) {
  return request({
    url: '/customer/customer/profile',
    method: 'get',
    data: data
  })
}

// 修改手机号
export function changeMobile (data) {
  return request({
    url: '/customer/customer/change_mobile',
    method: 'post',
    data: data
  })
}

// 修改密码登录状态
export function changePassword (data) {
  return request({
    url: '/customer/auth/change_password',
    method: 'post',
    data: {
      old_password: data.oldPass,
      new_password: data.newPass
    }
  })
}

// 购买应用分开，接口一样，类型不同而已
// 续费应用
export function renewApp (data) {
  return request({
    url: '/app/app/buy',
    method: 'post',
    data: { type: 'renew', ...data }
  })
}

// 激活应用
export function activeApp (data) {
  return request({
    url: '/app/app/buy',
    method: 'post',
    params: { type: 'active', ...data }
  })
}

// 订单列表
export function orderList (data) {
  return request({
    url: '/app/order/lists',
    method: 'get',
    params: data
  })
}

// 进入应用
export function goinApp (id) {
  return request({
    url: '/app/app/jump',
    method: 'get',
    params: {
      tenant_id: id
    }
  })
}
