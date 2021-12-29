<template>
  <my-navigation />
  <div style="text-align: left;margin-top: 2px;margin-bottom: 2px">
    <el-button type="primary" size="small" @click="back"><span style="font-weight: bold">返回</span></el-button>
    <el-button type="primary" size="small" @click="forward"><span style="font-weight: bold">前进</span></el-button>
  </div>
  <router-view/>
  <notice/>

  <el-link href="https://github.com/AgMonk/open_nga_2" target="_blank">[GitHub]</el-link>
  <el-backtop :bottom="100">
    <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
    >
      UP
    </div>
  </el-backtop>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import NgaBreadcrumb from "@/components/nga/nga-breadcrumb";
import MyNavigation from "@/components/my/my-navigation";
import {mapActions} from "vuex";
import Notice from "@/views/Notice";

export default {
  components: {Notice, MyNavigation, NgaBreadcrumb},
  methods: {
    ...mapActions("users", [`loadCurrentUser`]),
    back() {
      history.back()
    },
    forward() {
      history.forward()
    },

  },
  async mounted() {
    await this.loadCurrentUser()
  },
  data(){
    return{}
  }
}
</script>