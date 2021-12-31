<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <div>{{ title }}</div>
      <el-button size="small" type="success" @click="get(true)">刷新</el-button>
      <my-router-link :to="{name:'发帖',params:{action:'new'},query:{fid:forum.fid,stid:forum.setName?forum.toppedTid:undefined}}">
        <el-button size="small" type="primary">发帖</el-button>
      </my-router-link>
    </el-header>
    <el-main style="--el-main-padding:0">
      <div v-if="forum && forum.children && forum.children.length>0">
        <el-divider content-position="left">子版面/合集</el-divider>
        <nga-forum-avatar v-for="forum in forum.children" :forum="forum"/>
      </div>
      <thread-table v-if="threads" :threads="threads" :pageData="pageData"/>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapMutations} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";
import ThreadTable from "@/components/nga/thread/thread-table";
import NgaForumAvatar from "@/components/nga/forum/nga-forum-avatar";
import MyRouterLink from "@/components/my/my-router-link";
import {keypressEvent} from "@/assets/utils/DomUtils";
import {ElMessage} from "element-plus";

export default {
  name: "ThreadTab",
  components: {MyRouterLink, ThreadTable, NgaForumAvatar},
  data() {
    return {
      title: "",
      threads: [],
      pageData: {},
      forum: {},
    }
  },

  methods: {
    ...mapActions("thread", [`getThreadsOfSet`, `getThreadsOfForum`, `getFavor`, `getSearchByUser`]),
    ...mapMutations("breadcrumb", [`setWithThread`]),
    ...mapMutations("history", [`addHistoryForum`, `addHistorySet`]),
    //浏览版面主题
    async listThreadsOfForum(param) {
      const res = await this.getThreadsOfForum(param)
      const {recommend, fid} = param
      const forum = res.forum
      this.setWithThread({forum, recommend})
      this.addHistoryForum({fid, name: forum.name, recommend})
      this.title = recommend ? `${forum.name}[精华区]` : forum.name
      setTitle(this.title)
      return res;
    },
    //浏览合集主题
    async listThreadsOfSet(param) {
      const res = await this.getThreadsOfSet(param)
      const {fid} = param
      const forum = res.forum
      this.setWithThread({forum})
      this.addHistoryForum({fid, name: forum.name})
      this.addHistorySet({stid: forum.toppedTid, name: forum.setName, forumName: forum.name})
      this.title = `${forum.setName} - ${forum.name}`;
      setTitle(this.title)
      return res;
    },
    //查询已收藏主题
    async listFavor(param) {
      const res = await this.getFavor(param)
      this.title = '我的收藏'
      setTitle(this.title)
      return res;
    },
    //搜索用户发言
    async listSearchByUser(param) {
      const res = await this.getSearchByUser(param)
      const {recommend, fid} = param
      const {forum} = res;
      const a = ["用户"];
      if (forum.name) {
        this.setWithThread({forum, recommend})
        this.addHistoryForum({fid, name: forum.name, recommend})
        a.push(`在版面 [${forum.name}]`)
      }
      a.push("发布的")
      if (recommend) {
        a.push('精华主题')
      } else {
        a.push(param.searchpost ? '回复' : '主题')
      }
      this.title = a.join("");
      setTitle(this.title)
      return res;
    },
    //获取数据
    async get(force, route = this.$route) {
      const param = {force, ...route.query, ...route.params,}
      // noinspection NonAsciiCharacters
      const methodMap = {
        "浏览版面主题": this.listThreadsOfForum,
        "搜索用户发言": this.listSearchByUser,
        "浏览合集主题": this.listThreadsOfSet,
        "已收藏主题": this.listFavor,
      }
      let method = methodMap[route.name];
      if (method) {
        const res = await method(param)
        console.log(res)
        if (res) {
          this.threads = res.threads
          this.pageData = res.pageData
          this.forum = res.forum
          if (force) {
            ElMessage.success("刷新成功")
          }
        }
      }
    },
    keypress(e) {
      const methods = {
        r: () => this.get(true),
      }
      keypressEvent(e, methods)
    },
  },
  mounted() {
    setTitle(this.$route.name)
    document.addEventListener('keypress', this.keypress)
    this.get(false)
  },
  unmounted() {
    document.removeEventListener('keypress', this.keypress)
  },

  watch: {
    $route(to, from) {
      this.get(false, to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>