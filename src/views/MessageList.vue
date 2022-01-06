<template>
  <el-table :data="messages"
            :header-cell-style="getHeaderRowStyle"
            :header-row-style="getHeaderRowStyle"
            :row-style="getRowStyle()"
  >
    <el-table-column label="回复" prop="replies" width="70px" />
    <!--        todo 详情跳转 未读加粗 -->
    <el-table-column label="标题" prop="subject" />
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
</template>

<script>
import NgaUserLink from "@/components/nga/user/nga-user-link";
import MyTimestamp from "@/components/my/my-timestamp";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "MessageList",
  components: {MyTimestamp, NgaUserLink},
  data() {
    return {
      messages: [],
      pageData: {},
    }
  },
  computed: {},
  methods: {
    ...mapGetters('config', [`getHeaderRowStyle`, `getRowStyle`]),
    ...mapActions('messages', [`listMessages`]),
    async update(page, force = false) {
      const data = await this.listMessages({page, force})
      this.messages = data.messages
      this.pageData = data.pageData
    }
  },
  mounted() {
    this.update(this.$route.params.page)
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