import request from '@/utils/request'
// 手机密码登录
export function loginByPass (data) {
  return request({
    url: '/customer/auth/account_login',
    method: 'post',
    data: {
      mobile: data.mobile,
      password: data.password
    }
  })
}

// 手机验证码登录
export function loginByTel (data) {
  return request({
    url: '/customer/auth/mobile_login',
    method: 'post',
    data: {
      mobile: data.mobile,
      captcha_sms: data.captcha_sms
    }
  })
}

// 注册
export function register (data) {
  return request({
    url: '/customer/auth/register',
    method: 'post',
    data: data
  })
}

// 短信验证码
export function getTelCode (data) {
  return request({
    url: '/customer/captcha/sms',
    method: 'post',
    data: data
  })
}

// // 图形验证码
// export function getImgCode() {
//   return request({
//     url: '/customer/captcha/image',
//     method: 'get'
//   })
// }

// 找回重置密码
export function resetPassword (data) {
  return request({
    url: '/customer/auth/reset_password',
    method: 'post',
    data: data
  })
}
