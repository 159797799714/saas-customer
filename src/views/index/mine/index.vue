<template>
  <div class="mine">
    <div class="leftNav">
      <el-menu :default-active="selectIndex" class="el-menu-vertical-demo" @select="selectAction">
        <el-menu-item v-for="(item, index) in tabList" :key="index" :class="{actived: selectIndex === 'index' }" :index="index.toString()">
          <i :class="item.icon"/>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="rightMain">
      <router-view/>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      selectIndex: '0',
      tabList: [
        {
          title: '应用管理',
          icon: 'iconfont iconyingyong',
          name: 'appKeep'
        }, {
          title: '个人资料',
          icon: 'iconfont icongeren',
          name: 'personal'
        }, {
          title: '订单管理',
          icon: 'iconfont icondindan',
          name: 'order'
        }, {
          title: '登录日志',
          icon: 'iconfont iconrizhi',
          name: 'journal'
        }
      ]
    }
  },
  mounted () {
    if (window.history && window.history.pushState) {
      // 向历史记录中插入了当前页
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  destroyed () {
    window.removeEventListener('popstate', this.goBack, false)
  },
  methods: {
    selectAction (index, keyPath) {
      this.selectIndex = index
      switch (index) {
        case '0':
          this.$router.push({ name: 'appKeep' })
          break
        case '1':
          this.$router.push({ name: 'personal' })
          break
        case '2':
          this.$router.push({ name: 'order' })
          break
        case '3':
          this.$router.push({ name: 'journal' })
          break
      }
    },
    goBack () {
      this.tabList.map((item, index) => {
        if (item.name === this.$route.name) {
          this.selectIndex = index + ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.mine{
  display: flex;
  flex: 1;
  margin: 16px;
  background: #fff;
  .leftNav{
    height: 100%;
    width: 200px;
    border-right: 1px solid $border-color;
    padding-top: 17px;
    .actived{
      border-right: 4px solid #4993FF;
    }
  }
  .rightMain{
    flex: 1;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
}
</style>
