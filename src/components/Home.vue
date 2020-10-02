<template>
  <div id="home">
    <el-button type="info" @click="logOut">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped></style>
