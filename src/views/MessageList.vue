<template>
  <div>
    <el-button size="small" type="success" @click="refresh">刷新</el-button>
    <!--      todo 下一页-->
    <el-table v-loading="loading"
              :data="messages"
              :header-cell-style="getHeaderRowStyle"
              :header-row-style="getHeaderRowStyle"
              :row-style="getRowStyle()"
    >
      <el-table-column label="回复" prop="replies" width="70px" />
      <!--        todo 详情跳转 未读加粗 -->
      <el-table-column label="标题" prop="subject">
        <template #default="s">
          <my-router-link :to="{name:'短消息阅读',params:{mid:s.row.mid,page:1}}">{{ s.row.subject }}</my-router-link>
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
  </div>
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