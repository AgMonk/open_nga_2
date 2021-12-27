<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="我的收藏" style="text-align: left">
          <nga-forum-avatar v-for="forum in favorForums" :forum="forum"/>
        </el-tab-pane>


        <el-tab-pane label="Config">Config</el-tab-pane>
        <el-tab-pane label="Role">Role</el-tab-pane>
        <el-tab-pane label="Task">Task</el-tab-pane>
      </el-tabs>

    </el-main>
    <el-footer>
      <div>

        <el-input v-model="cookie"/>
        <el-button @click="setCookie">设置cookie</el-button>
      </div>
    </el-footer>
  </el-container>


</template>

<script>
// @ is an alias to /src
import {setCookies} from "@/assets/utils/CookieUtils";
import {mapActions} from "vuex";
import NgaForumAvatar from "@/components/nga/forum/nga-forum-avatar";
import {setTitle} from "@/assets/request/ProjectUtils";

export default {
  name: 'Home',
  components: {NgaForumAvatar},
  data() {
    return {
      cookie: '',
      favorForums: [],
    }
  },
  methods: {
    ...mapActions("forums", [`getFavorForums`,`searchForum`]),
    ...mapActions("users", [`getUserInfo`]),
    setCookie() {
      setCookies(this.cookie, 90, '/nga-api')
    },
    async refresh(force) {
      const res = await this.getFavorForums(force);
      this.favorForums = res.data.favorForums;
      return res.data.favorForums
    }
  },
  mounted() {
    setTitle("主页")
    this.refresh(false)
    this.getUserInfo(39841854).then(res=>{
      console.log(res);
    })
  }
}
</script>
