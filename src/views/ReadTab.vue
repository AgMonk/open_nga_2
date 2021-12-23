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
    ...mapMutations("history",[`addHistoryThread`,`addHistoryForum`,`addHistorySet`]),
    async get(force) {
      const {pid, tid, page, authorid} = Object.assign({}, this.$route.query, this.$route.params)
      const res = await this.getReplies({pid, tid, page, authorid, force})
      const data = res.data;
      const {forum,thread} = data;
      const subForum = thread.subForum
      console.log(data);
      setTitle(forum.name)

      this.pageData = data.pageData;
      this.replies = data.replies;

      this.addHistoryThread({tid,name:thread.subject})
      this.addHistoryForum({fid:thread.fid,name:forum.name})
      if (subForum){
        this.addHistorySet({stid:subForum.tid,name:subForum.subject,forumName:forum.name})
      }
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