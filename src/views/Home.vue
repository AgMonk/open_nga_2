<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="我的收藏" style="text-align: left">
          <forum-avatar v-for="forum in favorForums" :fid="forum.fid" :name="forum.name"/>
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
import ForumAvatar from "@/components/my-icon/forum-avatar";

export default {
  name: 'Home',
  components: {ForumAvatar},
  data() {
    return {
      cookie: '',
      favorForums: [],
    }
  },
  methods: {
    ...mapActions("forums", [`getFavorForums`,`searchForum`]),
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
    this.refresh(false)

    this.searchForum({key:"国家地理俱乐部"}).then(res=>{
      console.log(res)
    })
  }
}
</script>
