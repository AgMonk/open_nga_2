<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <div id="搜索条件" style="text-align: left">
        <nga-search-param :data="params" :mode="mode" />
      </div>

      <router-view />
    </el-main>
  </el-container>

</template>

<script>
import NgaBreadcrumb from "@/components/nga/nga-breadcrumb";
import {mapActions, mapState} from "vuex";
import NgaSearchParam from "@/components/nga/search/nga-search-param";


export default {
  name: "Search",
  components: {NgaSearchParam, NgaBreadcrumb},
  computed: {
    ...mapState('history', [`forums`, `sets`]),
  },
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
    ...mapActions('forums', [`getFavorForums`]),
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