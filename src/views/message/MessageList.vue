<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="text-align: left">
      <el-button size="small" type="success" @click="refresh">刷新</el-button>
      <my-router-link v-if="pageData && pageData.currentPage>1" :to="{name:'短消息列表',params:{page:pageData.currentPage-1}}">
        <el-button size="small" type="primary">上一页</el-button>
      </my-router-link>
      <my-router-link v-if="pageData &&pageData.hasNext" :to="{name:'短消息列表',params:{page:pageData.currentPage+1}}">
        <el-button size="small" type="primary">下一页</el-button>
      </my-router-link>
    </el-header>

    <el-main v-loading="loading" :element-loading-spinner="svg" element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-svg-view-box="-10, -10, 50, 50"
             element-loading-text="Loading..."
    >
      <el-table
          :data="messages"
          :header-cell-style="getHeaderRowStyle"
          :header-row-style="getHeaderRowStyle"
          :row-style="getRowStyle()"
      >
        <el-table-column label="回复" prop="replies" width="70px" />
        <el-table-column label="标题" prop="subject">
          <template #default="s">
            <my-router-link :style="s.row.unread?{'font-weight': 'bold'}:{}" :to="{name:'短消息阅读',params:{mid:s.row.mid,page:1}}">{{ s.row.subject }}</my-router-link>
            <el-tag v-if="s.row.unread" size="small" type="danger">未读</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发起人(时间)" width="180">
          <template #default="s">
            <span v-if="s.row.users.author.uid===0">[系统消息]</span>
            <nga-user-link v-else :text="s.row.users.author.username" :uid="s.row.users.author.uid" />
            <br>
            <my-timestamp :time="s.row.timestamp.create.time" />
          </template>
        </el-table-column>
        <el-table-column label="最后回复(时间)" width="180">
          <template #default="s">
            <span v-if="s.row.users.author.uid===0">[系统消息]</span>
            <nga-user-link v-else :text="s.row.users.lastReply.username" :uid="s.row.users.lastReply.uid" />
            <br>
            <my-timestamp :time="s.row.timestamp.lastModify.time" />
          </template>
        </el-table-column>

      </el-table>
    </el-main>
  </el-container>

</template>

<script>
import NgaUserLink from "@/components/nga/user/nga-user-link";
import MyTimestamp from "@/components/my/my-timestamp";
import {mapActions, mapGetters} from "vuex";
import {ElMessage} from "element-plus";
import MyRouterLink from "@/components/my/my-router-link";
import {setTitle} from "@/assets/request/ProjectUtils";

export default {
  name: "MessageList",
  components: {MyRouterLink, MyTimestamp, NgaUserLink},
  data() {
    return {
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15 " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/> `,
      loading: false,
      messages: [],
      pageData: {},
    }
  },
  computed: {},
  methods: {
    ...mapGetters('config', [`getHeaderRowStyle`, `getRowStyle`]),
    ...mapActions('messages', [`listMessages`]),
    async update(page, force = false) {
      this.loading = true;
      const data = await this.listMessages({page, force})
      this.messages = data.messages
      this.pageData = data.pageData
      this.loading = false;
      if (force) {
        ElMessage.success("刷新成功")
      }
    },
    refresh() {
      this.update(this.$route.params.page, true)
    }
  },
  async mounted() {
    await this.update(this.$route.params.page)
    setTitle('短消息列表')
  },
  watch: {
    $route(to) {
      if (to.name === '短消息列表') {
        this.update(to.params.page)
      }
    }
  },
  props: {},
}

</script>

<style scoped>
</style>