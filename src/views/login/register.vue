<template>
  <div class="login-container">
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo加载失败">
      <span>有米兔</span>
    </div>
    <div class="login-content">
      <div class="leftBox">
        <img src="@/assets/login/register.png" alt="">
      </div>
      <div class="form">
        <div class="headBar">
          <div class="tag">注册</div>
        </div>
        <el-form ref="registerForm" :model="registerForm" :rules="rules" status-icon class="demo-ruleForm" >
          <el-form-item prop="mobile" class="ipt" size="small">
            <el-input v-model="registerForm.mobile" :autofocus="true" placeholder="手机号码" prefix-icon="iconfont iconwode" size="small" @keyup.enter.native="goRegister('registerForm')" maxlength="11" auto-complete="off"/>
          </el-form-item>
          <el-form-item prop="password" class="ipt" size="small">
            <el-input v-model="registerForm.password" type="password" placeholder="6-16位密码，区分大小写" prefix-icon="iconfont iconsuo" @keyup.enter.native="goRegister('registerForm')" size="small" minlength="6" maxlength="16" auto-complete="off"/>
          </el-form-item>
          <el-form-item prop="checkPass" class="ipt" size="small">
            <el-input v-model="registerForm.checkPass" type="password" placeholder="确认密码" prefix-icon="iconfont iconsuo" size="small" @keyup.enter.native="goRegister('registerForm')" minlength="6" maxlength="16" auto-complete="off"/>
          </el-form-item>
        <!-- <div class="code ipt">
          <el-input v-model="registerForm.captcha_sms" placeholder="输入验证码" prefix-icon="iconfont iconyanzhengma" size="small" maxlength="6"/>
          <el-button v-if="!codeActived" type="primary" size="small" class="code-btn" @click="getCode">获取验证码</el-button>
          <el-button v-if="codeActived" type="primary" size="small" class="code-btn" plain>{{ num }} s</el-button>
        </div> -->
          <el-form-item prop="captcha_sms"  class="code ipt">
            <el-input v-model="registerForm.captcha_sms" placeholder="6位验证码" prefix-icon="iconfont iconyanzhengma"  @keyup.enter.native="goRegister('registerForm')" size="small" maxlength="6"/>
            <el-button v-if="!codeActived" type="primary" size="small" class="code-btn" @click="getCode">获取验证码</el-button>
          <el-button v-if="codeActived" type="primary" size="small" class="code-btn" plain>{{ num }} s</el-button>
          </el-form-item>
         </el-form>
        <div class="other ipt">
          <el-checkbox v-model="checked" size="small">我已阅读并同意《有米兔用户服务协议》</el-checkbox>
        </div>
        <div class="submit-btn ipt">
          <el-button type="primary" class="login-btn" @click="goRegister('registerForm')">注册</el-button>
        </div>
        <div class="notHave">
          已有账号？<el-button type="text" @click="goLogin">马上登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getImgCode, getTelCode, register } from '@/api/login'
import { getTelCode, register } from '@/api/login'
export default {
  name: 'Login',
  data () {
    var checkmobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号码'))
        } else if (/^1[3456789]\d{9}$/.test(value)) {
          callback()
        } else {
          callback(new Error('手机号格式错误'))
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        if (value.length > 5 && value.length < 17) {
          callback()
        } else {
          callback(new Error('密码长度只能为6-16位'))
        }
      }
    }
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else if (value.length < 6) {
        callback(new Error('验证码必须为6位数'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        mobile: '',
        password: '',
        checkPass: '',
        captcha_sms: ''
      },
      checked: true,
      codeActived: false,
      num: 60,
      rules: {
        mobile: [
          { validator: checkmobile, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        captcha_sms: [
          { validator: validateCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getCode () {
      if (/^1[3456789]\d{9}$/.test(this.registerForm.mobile)) {
        const data = {
          mobile: this.registerForm.mobile,
          type: 'register'
        }
        getTelCode(data).then(res => {
          if (res.data.message === 'success') {
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
            this.$message.error('验证码请求失败')
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message.error('请输入手机号码')
      }
    },
    goRegister (formName) {
      if (!this.checked) {
        this.$message.error('请勾选有米兔用户协议')
      } else {
        const form = this.registerForm
        this.$refs[formName].validate((valid) => {
          if (valid) {
            register(form).then(res => {
              if (res.data.message === 'success') {
                this.$message({
                  type: 'success',
                  message: '注册成功',
                  duration: 1000
                })
                // 注册成功后免登录直接进入
                this.$store.dispatch('LoginByPass', form).then((res) => {
                  if (res.data.status) {
                    sessionStorage.clear()
                    this.loading = true
                    this.$router.push({ path: this.redirect || '/' })
                  } else {
                    this.$message.error(res.data.message)
                  }
                }).catch(() => {
                  this.$router.push({ name: 'login' })
                })
              } else {
                this.$message.error(res.data.message)
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            return false
          }
        })
      }
    },
    goLogin () {
      this.$refs['registerForm'].resetFields()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
          height: 28px;
          font-size: 20px;
          font-weight: 600;
          line-height: 28px;
          color: #444444;
          text-align: center;
        }
        .actived{
          color: #4993FF;
          border-bottom: 2px solid #4993FF;
        }
      }
      .ipt{
        margin-bottom: 20px;
      }
      .code{
        display: flex;
        .ipt-space{
          flex: 1;
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
}
</style>
<style scoped>
.code >>> .el-form-item__content{
  flex: 1;
}
</style>
