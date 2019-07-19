<template>
  <div class="login-container">
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo加载失败">
      <span>有米兔</span>
    </div>
    <div class="login-content">
      <div class="leftBox">
        <img v-if="tabItem === 0" src="@/assets/login/user.png" alt="">
        <img v-if="tabItem === 1" src="@/assets/login/code.png" alt="">
      </div>
      <div class="form">
        <div class="headBar">
          <div v-for="(item, index) in tabList" :key="index" :class="{tag: true, actived: index === tabItem}" @click="selectedBar(index)">{{ item }}</div>
        </div>
        <el-form ref="loginForm" :model="loginForm" :rules="rules" status-icon class="demo-ruleForm" @submit.native.prevent>
          <el-form-item prop="mobile">
            <el-input v-model.number="loginForm.mobile" :autofocus="true" placeholder="手机号码" prefix-icon="iconfont iconwode" size="small" @keyup.enter.native="loginIn" maxlength="11" auto-complete="off"/>
          </el-form-item>
          <el-form-item v-if="tabItem === 0" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="6-16位密码，区分大小写" prefix-icon="iconfont iconsuo" size="small" @keyup.enter.native="loginIn" minlength="6" maxlength="16" auto-complete="off"/>
          </el-form-item>
          <div v-if="tabItem === 1" class="code ipt">
            <el-input v-model="loginForm.captcha_sms" placeholder="输入验证码" prefix-icon="iconfont iconyanzhengma" size="small" class="code-ipt" maxlength="6" @keyup.enter.native="loginIn"/>
            <el-button v-if="!codeActived" type="primary" size="small" class="code-btn" @click="getCode(loginForm.mobile)">获取验证码</el-button>
            <el-button v-if="codeActived" type="primary" size="small" class="code-btn" plain>{{ num }} s</el-button>
          </div>

        </el-form>
        <div class="other ipt">
          <el-checkbox v-model="checked">记住登录状态</el-checkbox>
          <el-button type="text" @click="goForget">忘记密码</el-button>
        </div>
        <div class="submit-btn ipt">
          <el-button type="primary" class="login-btn" native-type="submit" @click="loginIn">登录</el-button>
        </div>
        <div class="notHave">
          还没有账号？<el-button type="text" @click="goRegister">免费注册</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTelCode } from '@/api/login'
export default {
  name: 'Login',
  data () {
    var checkmobile = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }, 500)
    }
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      setTimeout(() => {
        if (value.length > 5 && value.length < 17) {
          callback()
        } else {
          callback(new Error('密码长度只能为6-16位'))
        }
      }, 500)
    }
    return {
      loginForm: {
        mobile: '',
        password: '',
        captcha_sms: ''
      },
      tabList: ['账号密码登录', '验证码登录'],
      imgUrl: '../../assets/login/user.png',
      checked: false,
      tabItem: 0,
      codeActived: false,
      num: 60,
      rules: {
        mobile: [
          { validator: checkmobile, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    tabItem (val, oldval) {
      this.$refs['loginForm'].resetFields()
      this.codeActived = false
    },
    checked (val, oldval) {
      if (!val) {
        sessionStorage.clear()
      }
    }
  },
  created () {
    if (sessionStorage.loginForm !== undefined) {
      var loginForm = sessionStorage.loginForm
      this.loginForm = JSON.parse(loginForm)
    }
  },
  methods: {
    selectedBar (index) {
      this.tabItem = index
    },
    getCode (mobile) {
      if ((/^1[3456789]\d{9}$/.test(mobile))) {
        const form = {
          mobile: this.loginForm.mobile,
          type: 'login'
        }
        getTelCode(form).then(res => {
          if (res.data.message === 'success') {
            this.num = 60
            this.codeActived = true
            var timer = setInterval(function () {
              this.num -= 1
              if (this.num <= 0) {
                clearInterval(timer)
                this.codeActived = false
                this.num = 60
              }
            }.bind(this), 1000)
          } else {
            this.$$message.error('验证码请求出错，请稍后重试')
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.$message.error('请输入正确的手机号码')
      }
    },
    goRegister () {
      this.$router.push({ name: 'register' })
    },
    goForget () {
      this.$router.push({ name: 'forget' })
    },
    loginIn () {
      // 初始化sessionStorage 和  localStorage
      sessionStorage.clear()
      localStorage.clear()
      // 退出之前老帐户
      this.$store.dispatch('FedLogOut')

      if (this.loginForm.mobile !== '') {
        // 密码登录
        if (this.tabItem === 0) {
          if (this.loginForm.password !== '' && this.loginForm.password.length > 5) {
            this.$store.dispatch('LoginByPass', this.loginForm).then((res) => {
              if (res.data.status) {
                if (this.checked) {
                  sessionStorage.setItem('loginForm', JSON.stringify(this.loginForm))
                } else {
                  sessionStorage.clear()
                }
                this.$refs['loginForm'].resetFields()
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              } else {
                if (res.data.message === '账号不存在') {
                  this.$confirm('检测到当前账号还未注册，是否去注册?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$router.push({ name: 'register' })
                    sessionStorage.setItem('headIndex', '')
                  }).catch(() => {
                    this.$refs['loginForm'].resetFields()
                  })
                } else {
                  this.$message.error(res.data.message)
                }
              }
            }).catch((err) => {
              this.$message.error(err)
              this.loading = false
            })
          } else {
            this.$message.error('密码格式错误')
          }
        }
        // 手机验证码登录
        if (this.tabItem === 1) {
          if (this.loginForm.captcha_sms) {
            this.$store.dispatch('LoginByTel', this.loginForm).then((res) => {
              if (res.data.status) {
                this.$refs['loginForm'].resetFields()
                if (this.checked) {
                  // localStorage.setItem('Authorization', Authorization)
                }
                this.loading = false
                this.$router.push({ path: this.redirect || '/' })
              } else {
                if (res.data.message === '账号不存在') {
                  this.$confirm('检测到当前账号还未注册，是否去注册?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.$router.push({ name: 'register' })
                    sessionStorage.setItem('headIndex', '')
                  }).catch(() => {
                    this.$refs['loginForm'].resetFields()
                  })
                } else {
                  this.$message.error(res.data.message)
                }
              }
            }).catch(() => {
              this.loading = false
            })
          } else if (this.loginForm.captcha_sms === '') {
            this.$message.error('手机验证码不能为空')
          }
        }
      } else {
        this.$message.error('手机号码不能为空')
      }
      // 登录信息超过一小时，要重新登录
      // setTimeout(function () {
      //   this.$alert('您的登录信息过期了，请重新登录', '温馨提示', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //       sessionStorage.clear()
      //       // localStorage.clear()
      //       this.$store.dispatch('FedLogOut').then(() => {
      //         location.reload() // 为了重新实例化vue-router对象 避免bug
      //       })
      //     }
      //   })
      // }.bind(this), 3000)
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
// @import "src/views/login/common.scss";
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #fff;
  .logo{
    display: flex;
    margin: 25px 0 0 35px;
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    color: #4993FF;
    font-weight: bold;
    &>img{
      height: 100%;
    }
  }
  .login-content{
    display: flex;
    width: 780px;
    height: 474px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border: 1px solid #ccc;
    .leftBox{
      height: 100%;
      width: 340px;
      background: #236CDD;
      position: relative;
      img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .form{
      flex: 1;
      padding: 40px;
      .headBar{
        position: relative;
        padding: 0 10px;
        margin-bottom: 33px;
        display: flex;
        justify-content: space-between;
        .tag{
          height: 38px;
          font-size: 20px;
          font-weight: 600;
          line-height: 38px;
          color: #444444;
          text-align: center;
          &:hover {
            cursor: pointer;
          }
        }
        .actived{
          color: #4993FF;
          border-bottom: 2px solid #4993FF;
        }
      }
      .ipt{
        margin-bottom: 22px;
      }
      .code{
        height: 40px;
        display: flex;
        .code-ipt{
          margin-top: 4px;
        }
        .code-btn{
          height: 32px;
          min-width: 100px;
          margin-top: 4px;
          margin-left: 16px;
        }
      }
      .login-btn{
        width: 100%;
      }
      .notHave{
        text-align: center;
      }
      .other{
        height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
