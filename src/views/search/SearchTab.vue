<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <!--      todo -->
      <div>{{ $route.name }}</div>
    </el-header>

    <el-main style="--el-main-padding:0">
      <div>{{ $route.params }}</div>
      <div>{{ $route.query }}</div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "SearchTab",
  data() {
    return {}
  },
  methods: {
    ...mapActions("search", [`getSearchInThread`, `getSearchInSet`]),
    async request(name, params, query, force) {
      if (name === '搜索版面主题') {
        return this.getSearchInThread({...params, ...query, force})
      }
      if (name === '搜索合集主题') {
        return this.getSearchInSet({...params, ...query, force})
      }
    },
    get(name, params, query, force) {
      this.request(name, params, query, force).then(res => {
        console.log(res)
      })
    },
    update(route) {
      const {params, query, name} = route

      console.log(params, query, name)
      this.get(name, params, query, false)
    },
  },
  mounted() {
    this.update(this.$route)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>