<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <div>{{ $route.name }}</div>
    </el-header>

    <el-main>
      <div>{{ $route.params }}</div>
      <div>{{ $route.query }}</div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapMutations} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";

export default {
  name: "ThreadTab",
  data() {
    return {}
  },

  methods: {
    ...mapActions("thread", [`getThreadsOfSet`, `getThreadsOfForum`, `getFavor`, `getSearchByUser`]),
    ...mapMutations("breadcrumb", [`setWithThread`]),
    ...mapMutations("history", [`addHistoryForum`, `addHistorySet`]),
    //浏览版面主题
    async listThreadsOfForum(param) {
      const res = await this.getThreadsOfForum(param)
      const {recommend, fid} = param
      const forum = res.data.forum
      this.setWithThread({forum, recommend})
      this.addHistoryForum({fid, name: forum.name, recommend})
      setTitle(recommend ? `${forum.name}[精华区]` : forum.name)
      return res;
    },
    //浏览合集主题
    async listThreadsOfSet(param) {
      const res = await this.getThreadsOfSet(param)
      const {fid} = param
      const forum = res.data.forum
      this.setWithThread({forum})
      this.addHistoryForum({fid, name: forum.name})
      this.addHistorySet({stid: forum.toppedTid, name: forum.setName, forumName: forum.name})
      setTitle(`${forum.setName} - ${forum.name}`)
      return res;
    },
    //查询已收藏主题
    async listFavor(page) {
      const res = await this.getFavor(page)
      setTitle('我的收藏')
      return res;
    },
    //搜索用户发言
    async listSearchByUser(param) {
      const res = await this.getSearchByUser(param)
      const {recommend, fid} = param
      const {forum} = res.data;
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
      setTitle(a.join(""))
      return res;
    },
    //获取数据
    async get(force, route = this.$route) {
      const param = {force, ...route.query, ...route.params,}
      let res
      switch (route.name) {
        case "浏览版面主题":
          res = this.listThreadsOfForum(param);
          break;
        case "搜索用户发言":
          res = this.listSearchByUser(param);
          break;
        case "浏览合集主题":
          res = this.listThreadsOfSet(param);
          break;
        case "已收藏主题":
          res = this.listFavor(param.page);
          break;
      }
      console.log(res)
    },
  },
  mounted() {
    setTitle(this.$route.name)
    this.get(false)
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