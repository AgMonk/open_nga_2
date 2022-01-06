<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <!--      todo 下一页-->

    </el-header>
    <el-main v-loading="loading">
      <div v-for="(row,i) in replies">
        <el-row :key="i" :style="getRowStyle()({rowIndex:i})">
          <el-col :span="6">
            <nga-read-user-card :uid="row.from" disable-avatar />
          </el-col>
          <el-col :span="18">
            <div style="text-align: left">
              <el-tag size="small">#{{ i }}</el-tag>
              <my-tag-with-tooltip disabled>{{ new Date(row.time * 1000).format("yyyy-MM-dd hh:mm:ss") }}</my-tag-with-tooltip>
            </div>
            <div :style="getRowStyle()({rowIndex:i})">
              <h2 v-if="row.subject" style="text-align: left">{{ row.subject }}</h2>
              <nga-content :content="row.content" />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";
import NgaReadUserCard from "@/components/nga/read/nga-read-user-card";
import NgaContent from "@/components/nga/read/nga-content";
import MyTimestamp from "@/components/my/my-timestamp";
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";

export default {
  name: "MessageRead",
  components: {MyTagWithTooltip, MyTimestamp, NgaContent, NgaReadUserCard},
  data() {
    return {
      loading: false,
      pageData: {},
      replies: {},
      subjectStatus: {},
    }
  },
  computed: {},
  methods: {
    ...mapGetters('config', [`getHeaderRowStyle`, `getRowStyle`]),
    ...mapActions('messages', [`readMessage`]),
    async update(mid, page, force = false) {
      this.loading = true;
      const res = await this.readMessage({mid, page, force})
      console.log(res)
      this.pageData = res.pageData
      this.replies = res.replies
      this.subjectStatus = res.subjectStatus
      this.loading = false;

    }
  },
  mounted() {
    const {mid, page} = this.$route.params
    setTitle('短消息内容')
    this.update(mid, page)
  },
  watch: {
    $route(to) {
      if (to.name === '短消息阅读') {
        this.update(to.params.mid, to.params.page)
      }
    }
  },
  props: {
    mid: {},
    page: {},
  },
}

</script>

<style scoped>

</style>