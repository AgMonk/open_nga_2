<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <!--      todo -->
      <div>{{ $route.name }}</div>
    </el-header>

    <el-main v-loading="loading" :element-loading-spinner="svg" element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-svg-view-box="-10, -10, 50, 50"
             element-loading-text="Loading..."
             style="--el-main-padding:0"
    >
      <thread-table v-if="threads" :pageData="pageData" :threads="threads" @favor-updated="get(true)" />

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import ThreadTable from "@/components/nga/thread/thread-table";

export default {
  name: "SearchTab",
  components: {ThreadTable},
  data() {
    return {
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15 " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/> `,
      loading: false,
      threads: [],
      pageData: [],
    }
  },
  methods: {
    ...mapActions("search", [`getSearchInThread`, `getSearchInSet`]),
    async request(name, params = {}, query = {}, force) {
      this.loading = true;
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
        this.threads = res.threads
        this.pageData = res.pageData
        this.loading = false;
      })
    },
    update(route) {
      const {params, query, name} = route
      this.get(name, params, query, false)
    },
  },
  mounted() {
    this.update(this.$route)
  },
  watch: {
    $route(to) {
      this.update(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>