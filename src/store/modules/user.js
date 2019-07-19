// import { login, logout, getInfo } from '@/api/login'
import { loginByPass, loginByTel } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { getToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    leftItem: '',
    httpUrl: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LEFTITEM: (state, leftItem) => {
      state.leftItem = leftItem
    },
    SET_HTTPURL: (state, httpUrl) => {
      state.httpUrl = httpUrl
    }
  },

  actions: {
    // 密码登录
    LoginByPass ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByPass(userInfo).then(response => {
          if (response.data.status) {
            const data = response.headers['authorization']
            setToken(data)
            commit('SET_TOKEN', data)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 手机验证码登录
    LoginByTel ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByTel(userInfo).then(response => {
          const data = response.headers['authorization']
          setToken(data)
          commit('SET_TOKEN', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(response => {
    //       const data = response.data
    //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', data.roles)
    //       } else {
    //         reject('getInfo: roles must be a non-null array !')
    //       }
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 控制httpUrl
    setHttpUrl ({ commit }, url) {
      return new Promise(resolve => {
        commit('SET_HTTPURL', url)
        resolve()
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
