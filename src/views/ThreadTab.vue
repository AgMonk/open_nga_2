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
import {mapActions} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";

export default {
  name: "ThreadTab",
  data() {
    return {}
  },

  methods: {
    ...mapActions("thread", [`getThreadsOfSet`, `getThreadsOfForum`]),
    async get(force, route) {
      route = route?route:this.$route;
      const param
          = Object.assign({force}, route.query, route.params)
      let res
      if (route.name === '浏览版面主题') {
        res = await this.getThreadsOfForum(param)
        setTitle(res.data.forum.name)
      } else if (route.name === '浏览合集主题') {
        res = await this.getThreadsOfSet(param)
        setTitle(`${res.data.forum.setName} - ${res.data.forum.name}`)
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
      this.get(false,to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>