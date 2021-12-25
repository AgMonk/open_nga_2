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
    ...mapActions("thread", [`getThreadsOfSet`, `getThreadsOfForum`,`getFavor`]),
    ...mapMutations("breadcrumb", [`setWithThread`]),
    ...mapMutations("history", [`addHistoryForum`,`addHistorySet`]),
    async get(force, route) {
      route = route ? route : this.$route;
      const param
          = Object.assign({force}, route.query, route.params)
      const recommend = param.recommend
      const fid = param.fid
      let res
      if (route.name === '浏览版面主题') {
        res = await this.getThreadsOfForum(param)
        const forum = res.data.forum
        //更新面包屑
        this.setWithThread({forum, recommend})
        //浏览历史
        this.addHistoryForum({fid,name:forum.name,recommend})
        setTitle(forum.name)
      } else if (route.name === '已收藏主题') {
        res = await this.getFavor(param.page)
        setTitle(route.name)
      } else if (route.name === '浏览合集主题') {
        res = await this.getThreadsOfSet(param)
        const forum = res.data.forum
        //更新面包屑
        this.setWithThread({forum})
        //浏览历史
        this.addHistoryForum({fid,name:forum.name})
        this.addHistorySet({stid:forum.toppedTid,name:forum.setName,forumName:forum.name})
        setTitle(`${forum.setName} - ${forum.name}`)
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