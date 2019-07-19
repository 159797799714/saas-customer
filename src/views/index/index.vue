<template>
  <div class="content">
    <div class="header">
      <div class="logo">
        <img src="@/assets/logo.png" alt="">
        <p>有米兔中台</p>
      </div>
      <div class="headnav">
        <div v-for="(item, index) in headNavList" :key="index" :class="{item: true, selected: headIndex == index}" @click="selectHeadNav(index)">{{ item.title }}</div>
        <div ref="slipe" class="slipe-span"/>
      </div>
      <div class="user">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img src="@/assets/admin.png" class="user-avatar">
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item>
              <span style="display:block" @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="main">
      <!-- <router-view/> -->
      <myapp v-if="headIndex === '0'" @pay="pay"/>
      <mine v-if="headIndex === '1'"/>
    </div>
  </div>
</template>

<script>
import Myapp from '@/views/index/myApp/index.vue'
import Mine from '@/views/index/mine/index.vue'
export default {
  components: {
    Myapp,
    Mine
  },
  data () {
    return {
      headIndex: '0',
      headNavList: [{
        title: '我的应用',
        pathName: 'myApp'
      }, {
        title: '个人中心',
        pathName: 'mine'
      }
      ],
      path: () => {
        return window.location.href
      }
    }
  },
  watch: {
    // headIndex (val, oldVal) {
    //   console.log(val, oldVal)
    // }
    path (val, oldVal) {
      console.log(val, oldVal)
    }
  },
  mounted () {
    if (this.$route.name === 'myApp') {
      this.$refs.slipe.style.left = 0
      this.headIndex = 0
      this.selectHeadNav(0)
    } else {
      this.$refs.slipe.style.left = sessionStorage.headIndex * 50 + '%'
      this.headIndex = sessionStorage.headIndex
    }
  },
  methods: {
    pay (pay) {
      this.selectHeadNav(1)
      sessionStorage.setItem('leftIndex', 2)
    },
    selectHeadNav (index) {
      sessionStorage.setItem('headIndex', index)
      sessionStorage.setItem('leftIndex', 0)
      this.headIndex = sessionStorage.headIndex
      this.$refs.slipe.style.left = index * 50 + '%'
      switch (index) {
        case 0:
          this.$router.push({ name: 'myApp' })
          break
        case 1:
          this.$router.push({ name: 'appKeep' })
          break
      }
    },
    logout () {
      // sessionStorage.clear()
      // localStorage.clear()
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
  .content{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #F7F9FB;
    .header{
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      text-align: center;
      background: #fff;
      .logo{
        width: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          display: block;
          height: 40px;
          width: 40px;
        }
        p{
          width: 80px;
          margin-left: 10px;
          line-height: 100%;
          font-size: 16px;
          font-weight: 600;
          color: $btn-color;
        }
      }
      .headnav{
        display: flex;
        position: relative;
        font-weight: 600;
        .item{
          width: 94px;
          text-align: center;
          &:hover {
            cursor: pointer;
          }
        }
        .slipe-span{
          height: 2px;
          width: 94px;
          background: $btn-color;
          position: absolute;
          bottom: 0;
          left: 0;
          transition: 800ms;
        }
      }
      .selected{
        color: $btn-color;
      }
      .user{
        height: 50px;
        width: 200px;
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
              cursor: pointer;
              margin-top: 5px;
              position: relative;
              line-height: initial;
              .user-avatar {
                margin-top: 14px;
                width: 22px;
                height: 22px;
                border-radius: 100%;
              }
              .el-icon-caret-bottom {
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
              }
            }
          }
      }
    }
    .main{
      flex: 1;
      display: flex;
    }
  }

</style>
