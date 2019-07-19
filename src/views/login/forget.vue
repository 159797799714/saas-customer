<template>
  <div class="login-container">
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo加载失败">
      <span>有米兔</span>
    </div>
    <div class="login-content">
      <div class="leftBox">
        <img src="@/assets/login/forget.png" alt="">
      </div>
      <div class="form">
        <div class="headBar">
          <div class="tag">忘记密码</div>
        </div>
        <el-form ref="resetForm" :model="resetForm" :rules="rules" status-icon class="demo-ruleForm">
          <el-form-item v-show="move === 0" prop="mobile" class="ipt" size="small">
            <el-input v-model.number="resetForm.mobile" placeholder="手机号码" prefix-icon="iconfont iconwode" size="small"  maxlength="11" auto-complete="off" @keyup.enter.native="nextAction(resetForm.captcha_sms)"/>
          </el-form-item>
          <div v-show="move === 0" class="code ipt">
            <el-input v-model="resetForm.captcha_sms" placeholder="输入验证码" prefix-icon="iconfont iconyanzhengma" size="small"  maxlength="6" @keyup.enter.native="nextAction(resetForm.captcha_sms)"/>
            <el-button v-show="!codeActived" type="primary" size="small" class="code-btn" @click="getCode">获取验证码</el-button>
            <el-button v-show="codeActived" type="primary" size="small" class="code-btn" plain>{{ num }} s</el-button>
          </div>
          <el-form-item v-show="move === 1" prop="password" class="ipt" size="small">
            <el-input v-model="resetForm.password" type="password" placeholder="6-16位密码，区分大小写" prefix-icon="iconfont iconsuo" size="small" minlength="6" maxlength="16" @keyup.enter.native="sureReset(resetForm)"/>
          </el-form-item>
          <el-form-item v-show="move === 1" prop="checkPass" class="ipt" size="small">
            <el-input v-model="resetForm.checkPass" type="password" placeholder="确认密码" prefix-icon="iconfont iconsuo" size="small"  minlength="6" maxlength="16" @keyup.enter.native="sureReset(resetForm)"/>
          </el-form-item>
        </el-form>

        <div class="submit-btn ipt">
          <el-button v-if="move === 0" type="primary" class="login-btn" @click="nextAction(resetForm.captcha_sms)">下一步</el-button>
          <el-button v-if="move === 1" type="primary" class="login-btn" @click="sureReset(resetForm)">确定</el-button>
        </div>
        <div class="notHave">
          又想起来了？<el-button type="text" @click="goLogin">马上登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTelCode, resetPassword } from '@/api/login'
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
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('再次确认密码不能为空'))
      } else if (value !== this.resetForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        if (value.length > 5 && value.length < 17) {
          callback()
        } else {
          callback(new Error('密码长度只能为6-16位'))
        }
      }
    }
    return {
      tel: '',
      resetForm: {
        mobile: '',
        password: '',
        checkPass: '',
        captcha_sms: ''
      },
      tabList: ['账号密码登录', '验证码登录'],
      checked: false,
      codeActived: false,
      num: 60,
      move: 0,
      rules: {
        mobile: [
          { validator: checkmobile, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getCode () {
      if (/^1[3456789]\d{9}$/.test(this.resetForm.mobile)) {
        const data = {
          mobile: this.resetForm.mobile,
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
    goLogin () {
      this.$refs['resetForm'].resetFields()
      this.$router.push({ name: 'login' })
    },
    nextAction (code) {
      if (code.length > 5 && /^1[3456789]\d{9}$/.test(this.resetForm.mobile)) {
        this.move = 1
      } else if (!/^1[3456789]\d{9}$/.test(this.resetForm.mobile)) {
        this.$message.error('请填写正确的手机号码')
      } else if (code.length < 6 && code !== '') {
        this.$message.error('验证码须为6-16位')
      } else {
        this.$message.error('验证码不能为空')
      }
    },
    sureReset (form) {
      if (form.password === form.checkPass && form.password.length > 5) {
        resetPassword(form).then(res => {
          if (res.data.message === 'success') {
            this.$confirm('密码已经重置成功, 是否跳转到登录页?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.$router.push({ name: 'login' })
            }).catch(() => {
              this.$refs['resetForm'].resetFields()
              this.resetForm.captcha_sms = ''
              this.move = 0
            })
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        this.$message.error('密码格式错误')
      }
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
          height: 38px;
          font-size: 20px;
          font-weight: 600;
          line-height: 38px;
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
        .code-btn{
          min-width: 100px;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
