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
  name: "ReadTab",
  data() {
    return {
      pageData: {
        total: 100,
        currentPage: 1,
        pageSize: 20,
      },
      replies:[],
    }
  },
  methods: {
    ...mapActions("read", [`getReplies`]),
    async get(force) {
      const {pid, tid, page, authorid} = Object.assign({}, this.$route.query, this.$route.params)
      const res = await this.getReplies({pid, tid, page, authorid, force})
      const data = res.data;
      console.log(data);
      setTitle(data.forum.name)

      this.pageData = data.pageData;
      this.replies = data.replies;
    }
  },
  mounted() {
    setTitle(this.$route.name)
    this.get(false)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>