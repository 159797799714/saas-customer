<template>
  <div class="personal-data">
    <div class="top">
      <div class="user-img">
        <img src="@/assets/admin.png" alt="">
      </div>
      <div>
        <!-- <el-button size="small" class="replace-btn">更换头像</el-button> -->
      </div>
    </div>
    <div class="row first-row">
      <div class="first-vertical">手机号码</div>
      <div class="second-vertical">{{ personalData.mobile }}</div>
      <div class="third-vertical"><el-button type="text" @click="goChangeTel">修改手机号</el-button></div>
    </div>
    <div class="row">
      <div class="first-vertical">登录密码</div>
      <div class="second-vertical">登录账号时需要输入的密码</div>
      <div class="third-vertical"><el-button type="text" @click="goReset">重置</el-button></div>
    </div>
    <div class="row">
      <div class="first-vertical">注册时间</div>
      <div class="second-vertical">{{ personalData.created_at }}</div>
      <div class="third-vertical"><el-button type="text"/></div>
    </div>
    <div class="row">
      <div class="first-vertical">最近一次登录</div>
      <div class="second-vertical">{{ personalData.last_login }}</div>
      <div class="third-vertical"><el-button type="text" @click="seeMore">查看更多</el-button></div>
    </div>
  </div>
</template>
<script>
import { getProfile } from '@/api/app.js'
export default {
  data () {
    return {
      personalData: {}
    }
  },
  beforeMount () {
    getProfile().then(res => {
      this.personalData = res.data.data
      var time = this.personalData.created_at
      this.personalData.created_at = time.slice(0, 4) + '年' + time.slice(5, 7) + '月' + time.slice(8, 10) + '日'
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    goChangeTel () {
      this.$router.push({ name: 'changeInfo', query: { origin: 'tel' } })
      sessionStorage.setItem('origin', 'tel')
    },
    goReset () {
      this.$router.push({ name: 'changeInfo', query: { origin: 'pass' } })
      sessionStorage.setItem('origin', 'pass')
    },
    seeMore () {
      this.$router.push({ name: 'journal', query: { info: this.selectItem } })
    }
  }
}
</script>

<style lang="scss" scoped>
$color-gray: #e8e8e8;
.personal-data{
  .top{
    display: flex;
    margin-top: 40px;
    margin-bottom: 33px;
    height: 60px;
    line-height: 60px;
    padding-left: 60px;
    .user-img{
      display: inline-block;
      margin-right: 30px;
      height: 60px;
      width: 60px;
      border-radius: 100%;
      overflow: hidden;
      border: 1px solid $color-gray;
      img{
        height: 100%;
        width: 100%;
      }
    }
    .replace-btn{
      color: #4993FF;
      border: 1px solid #4993FF;
    }
  }
  .row{
    display: flex;
    padding: 0 60px;
    height: 50px;
    justify-content: space-between;
    line-height: 50px;
    border-bottom: 1px solid $color-gray;
    .first-vertical{
      width: 160px;
    }
    .second-vertical{
      flex: 1;
      overflow: hidden;
    }
    .third-vertical{
      width: 80px;
      text-align: right;
    }
  }
  .first-row{
    border-top: 1px solid $color-gray;
  }
}
</style>
