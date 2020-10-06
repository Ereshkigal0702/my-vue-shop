<template>
  <el-container class="home_container">
    <el-header class="header_bgc">
      <div class="left_header">
        <img src="../assets/image/icon.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'200px'" class="aside_bgc">
        <div class="toggle-button" @click=toggleCollapse>|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
          unique-opened router :collapse="isCollapse" :collapse-transition="false"
          :default-active="activePath">
          <el-submenu :index="`${item.id}`" v-for="item in menuLists" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="`${subItem.path}`" @click="saveNameState(`/${subItem.path}`)"
              v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main_bgc">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuLists: [],
      url: '/users',
      iconsObj: {
        125: 'fa fa-users',
        103: 'fa fa-money',
        101: 'fa fa-suitcase',
        102: 'fa fa-book',
        145: 'fa fa-database'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.saveNameState(window.sessionStorage.getItem('activePath'))
  },
  methods: {
    logOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    getMenuList() {
      this.$http
        .get('menus')
        .then(res => {
          this.menuLists = res.data.data
          console.log(this.menuLists)
        })
        .catch(err => {
          this.$message.error(err.meta.msg)
        })
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNameState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.header_bgc {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
}
.aside_bgc {
  background-color: #333744;
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.main_bgc {
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
.left_header {
  display: flex;
  align-items: center;
}
span {
  margin-left: 15px;
}
.el-menu {
  border-right: 0;
}
</style>
