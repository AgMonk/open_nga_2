<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="text-align: left">
      <my-router-link :to="{name:'短消息列表',params:{page:1}}">
        <el-button size="small" type="primary">返回消息列表</el-button>
      </my-router-link>
      <my-router-link v-if="pageData && pageData.currentPage>1" :to="{name:'短消息阅读',params:{page:pageData.currentPage-1}}">
        <el-button size="small" type="primary">上一页</el-button>
      </my-router-link>
      <my-router-link v-if="pageData &&pageData.hasNext" :to="{name:'短消息阅读',params:{page:pageData.currentPage+1}}">
        <el-button size="small" type="primary">下一页</el-button>
      </my-router-link>

    </el-header>
    <el-main v-loading="loading" :element-loading-spinner="svg"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-svg-view-box="-10, -10, 50, 50"
             element-loading-text="Loading..."
    >
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
              <!--              {{row.content}}-->
              <nga-content :content="row.content" />
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="showPostUi" style="margin-top: 30px">
        <el-input v-model="params.subject" placeholder="标题" />
        <el-input id="nga-post-textarea"
                  v-model="params.content"
                  :rows="!params.content?5:Math.max(params.content.split(`\n`).length+1,5)" placeholder="正文"
                  style="margin-bottom: 5px"
                  type="textarea"
                  @keyup.enter.ctrl="reply"
        />
        <el-button style="margin-top: 20px" type="success" @click="reply">回复(Ctrl+Enter)</el-button>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";
import NgaReadUserCard from "@/components/nga/read/nga-read-user-card";
import NgaContent from "@/components/nga/content/nga-content";
import MyTimestamp from "@/components/my/my-timestamp";
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";
import MyRouterLink from "@/components/my/my-router-link";
import {replyMessage} from "@/assets/request/message-request";
import {ElMessage} from "element-plus";

export default {
  name: "MessageRead",
  components: {MyRouterLink, MyTagWithTooltip, MyTimestamp, NgaContent, NgaReadUserCard},
  data() {
    return {
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15 " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/> `,
      loading: false,
      showPostUi: true,
      pageData: {},
      replies: {},
      subjectStatus: {},
      params: {
        content: "",
        subject: "",
      }
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

      const user0 = res.userData.users[0]
      if (user0.uid === 0) {
        this.showPostUi = false
      } else {
        this.showPostUi = true
        this.focus()
      }
    },
    async reply() {
      const {mid, page} = this.$route.params
      const {content, subject} = this.params
      const res = await replyMessage(mid, content, subject)
      ElMessage.success(res['0'])
      this.params = {}
      await this.update(mid, page, true)
    },
    focus() {
      document.getElementById('nga-post-textarea').focus()
    },
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