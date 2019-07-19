<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
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
    goBack () {
      // console.log(window.location.pathname)
      // console.log(this.$route.name === 'myApp')
      // if (window.location.pathname === '/index/appKeep') {
      //   console.log('true')
      //   this.$router.push({ name: 'appKeep' })
      //   // location.reload() // 为了重新实例化vue-router对象 避免bug
      // }
      // 返回历史记录问题
      if (this.$route.name === 'myApp') {
        this.$router.go(1)
      }
    }
  }
}
</script>
