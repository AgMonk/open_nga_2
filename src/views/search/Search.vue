<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <div id="搜索条件" style="text-align: left">
        <nga-search-form :data="params" :mode="mode" />
      </div>

      <router-view />
    </el-main>
  </el-container>

</template>

<script>
import NgaSearchForm from "@/components/nga/search/nga-search-form";


export default {
  name: "Search",
  components: {NgaSearchForm},
  data() {
    return {
      size: 'small',
      mode: '版面',
      favorForums: [],
      favorSets: [],
      params: {
        fid: [],
        stid: [],
        key: "",
        recommend: false,
        content: false,
      }
    }
  },
  methods: {
    update(route) {

      const {params, query} = route;
      const {fid, stid, key} = params
      const {recommend, content} = query;

      this.params = {key}
      if (stid) {
        this.mode = '合集'
        this.params.stid = stid.split(',').map(i => parseInt(i))
      } else if (fid) {
        this.mode = '版面'
        this.params.fid = fid.split(',').map(i => parseInt(i))
      }
      this.params.recommend = recommend === '1'
      this.params.content = content === '1'
    }
  },
  mounted() {
    this.update(this.$route)
    document.getElementById('search-input').focus()
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
.el-main {
  --el-main-padding: 0;
  overflow-y: hidden;
}
</style>