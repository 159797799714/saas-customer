<template>
  <div class="main">
    <div class="row">
      <keep-alive>
        <div v-if="origin === 'tel'" class="first-vertical">修改手机号</div>
      </keep-alive>
      <keep-alive>
        <div v-if="origin === 'pass'" class="first-vertical">重置密码</div>
      </keep-alive>
      <div class="second-vertical"/>
    </div>
    <!-- 修改手机号 -->
    <el-form v-if="origin === 'tel'" ref="TelForm" :model="TelForm" :rules="rules" status-icon class="demo-ruleForm">
      <el-form-item prop="old_mobile">
        <div class="first-vertical">旧手机号</div>
        <div class="ipt_btn">
          <el-input v-model.number="TelForm.old_mobile" placeholder="请输入旧手机号" size="small" maxlength="11" :autofocus="true"/>
        </div>
      </el-form-item>
      <el-form-item prop="new_mobile">
        <div class="first-vertical">新手机号</div>
        <div class="ipt_btn">
          <el-input v-model.number="TelForm.new_mobile" placeholder="请输入新手机号" size="small" maxlength="11"/>
          <el-button v-if="!codeActived" type="primary" size="small" class="code-btn" @click="getCode(TelForm.new_mobile)">获取验证码</el-button>
          <el-button v-if="codeActived" type="primary" size="small" class="code-btn" plain>{{ num }} s</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="captcha_sms_old">
        <div class="first-vertical">验证码</div>
        <div class="ipt_btn">
          <el-input v-model="TelForm.captcha_sms_old" placeholder="请输入手机验证码" size="small" maxlength="6" auto-complete="off"/>
        </div>
      </el-form-item>
      <el-button type="primary" size="small" class="submit-btn" @click="submitAction(origin)">确定</el-button>
    </el-form>
    <!-- 重置密码 -->
    <el-form v-if="origin === 'pass'" ref="passForm" :model="passForm" :rules="rules" status-icon class="demo-ruleForm">
      <el-form-item prop="oldPass">
        <div class="first-vertical">旧密码</div>
        <div class="ipt_btn">
          <el-input v-model="passForm.oldPass" type="password" size="small" placeholder="请输入旧密码" maxlength="16" :autofocus="true"/>
        </div>
      </el-form-item>
      <el-form-item prop="newPass">
        <div class="first-vertical">新密码</div>
        <div class="ipt_btn">
          <el-input v-model="passForm.newPass" type="password" size="small" maxlength="16" placeholder="请输入新密码"/>
        </div>
      </el-form-item>
      <el-form-item prop="newPass2">
        <div class="first-vertical">确认密码</div>
        <div class="ipt_btn">
          <el-input v-model="passForm.newPass2" type="password" size="small" maxlength="16" placeholder="请输入再次输入新密码"/>
        </div>
      </el-form-item>
      <el-button type="primary" size="small" class="submit-btn" @click="submitAction(origin)">确定</el-button>
    </el-form>
  </div>
</template>

<script>
import { changeMobile, changePassword } from '@/api/app.js'
import { getTelCode } from '@/api/login.js'
export default {
  data () {
    var checkmobile = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('手机号码格式错误'))
        } else {
          callback()
        }
      }, 500)
    }
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'))
      }
      setTimeout(() => {
        if (value.length < 6) {
          callback(new Error('手机验证码须为6位数'))
        } else {
          callback()
        }
      }, 500)
    }
    var checkPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      setTimeout(() => {
        if (value.length < 6) {
          callback(new Error('密码须为6到16位数'))
        } else {
          callback()
        }
      }, 200)
    }
    var checkPass2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      setTimeout(() => {
        if (value.length < 6) {
          callback(new Error('密码须为6到16位数'))
        } else if (value !== this.passForm.newPass) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      }, 200)
    }
    return {
      origin: sessionStorage.origin,
      TelForm: {
        old_mobile: '',
        new_mobile: '',
        captcha_sms_old: ''
      },
      passForm: {
        oldPass: '',
        newPass: '',
        newPass2: ''
      },
      codeActived: false,
      num: 60,
      rules: {
        old_mobile: [
          { validator: checkmobile, trigger: 'blur' }
        ],
        new_mobile: [
          { validator: checkmobile, trigger: 'blur' }
        ],
        captcha_sms_old: [
          { validator: checkCode, trigger: 'blur' }
        ],
        oldPass: [
          { validator: checkPass, trigger: 'blur' }
        ],
        newPass: [
          { validator: checkPass, trigger: 'blur' }
        ],
        newPass2: [
          { validator: checkPass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getCode (mobile) {
      if (/^1[3456789]\d{9}$/.test(mobile)) {
        const data = {
          mobile: mobile,
          type: 'login'
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
        this.$message.error('请输入正确的新手机号码')
      }
    },
    submitAction (origin) {
      // 修改手机号码
      if (origin === 'tel') {
        var telForm = this.TelForm
        if (/^1[3456789]\d{9}$/.test(telForm.old_mobile)) {
          if (telForm.new_mobile !== '') {
            if (/^1[3456789]\d{9}$/.test(telForm.new_mobile)) {
              if (telForm.captcha_sms_old === '' || telForm.captcha_sms_old.length < 5) {
                this.$message.error('验证码格式错误')
              } else {
                changeMobile(telForm).then(res => {
                  if (res.data.status) {
                    this.$message({
                      type: 'success',
                      message: '恭喜你，修改手机号码成功'
                    })
                    sessionStorage.clear()
                    this.$store.dispatch('FedLogOut').then(() => {
                      location.reload() // 为了重新实例化vue-router对象 避免bug
                    })
                  } else {
                    this.$message.error(res.data.message)
                  }
                }).catch(err => {
                  console.log(err)
                })
              }
            } else if (telForm.old_mobile === telForm.new_mobile) {
              this.$message.error('新旧手机不能相同')
            } else {
              this.$message.error('新手机号码格式错误')
            }
          } else {
            this.$message.error('新手机号码不能为空')
          }
        } else {
          this.$message.error('旧手机号码格式错误')
        }
        // 修改密码
      } else if (origin === 'pass') {
        // var pass = this.passForm
        // if (pass.oldPass === '' || pass.oldPass.length < 6) {
        //   this.$message.error('旧密码格式错误')
        // } else if (pass.newPass === '' || pass.newPass.length < 6) {
        //   this.$message.error('新密码格式错误')
        // } else if (pass.newPass2 === '' || pass.newPass2.length < 6) {
        //   this.$message.error('确认密码格式错误')
        // } else if (pass.oldPass.length > 5 && pass.newPass.length > 5 && pass.newPass2.length > 5) {
        //   if (pass.newPass === pass.newPass2 && pass.newPass.length < 17 && pass.newPass2.length < 17) {
        //     changePassword(this.passForm).then(res => {
        //       if (res.data.status) {
        //         this.$message({
        //           type: 'success',
        //           message: '恭喜你，修改密码成功'
        //         })
        //         sessionStorage.clear()
        //         this.$store.dispatch('FedLogOut').then(() => {
        //           location.reload() // 为了重新实例化vue-router对象 避免bug
        //         })
        //       } else {
        //         this.$message.error(res.data.message)
        //       }
        //     }).catch(err => {
        //       console.log(err)
        //     })
        //   } else {
        //     this.$message.error('两次新密码输入不一致')
        //   }
        // }
        this.$refs['passForm'].validate((valid) => {
          if (valid) {
            changePassword(this.passForm).then(res => {
              if (res.data.status) {
                this.$message({
                  type: 'success',
                  message: '恭喜你，修改密码成功'
                })
                sessionStorage.clear()
                this.$store.dispatch('FedLogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
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
      this.codeActived = false
      this.num = 60
    }
  }
}
</script>

<style lang="scss" scoped>
$color-gray: #e8e8e8;
.main{
  flex: 1;
  padding: 50px 60px;
  .row{
    display: flex;
    height: 50px;
    justify-content: space-between;
    line-height: 50px;
    font-weight: 600;
    // .second-vertical{
    //   flex: 1;
    // }
    .third-vertical{
      width: 80px;
      text-align: right;
    }

  }
  .first-vertical{
    width: 96px;
    font-weight: 600;
  }
  .ipt_btn{
    display: flex;
    flex: 1;
  }
  .code-btn{
    margin-top: 4px;
    margin-left: 16px;
    height: 32px;
  }
  .submit-btn{
    width: 80px;
    margin-top: 20px;
  }
}
</style>
