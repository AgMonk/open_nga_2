<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header><h3>短消息</h3></el-header>
    <el-main style="--el-main-padding:0">
      <el-table :data="messages"
                :header-cell-style="headerRowStyle"
                :header-row-style="headerRowStyle"
                :row-style="rowStyle"
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
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import NgaUserLink from "@/components/nga/user/nga-user-link";
import MyTimestamp from "@/components/my/my-timestamp";

export default {
  name: "Messages",
  components: {MyTimestamp, NgaUserLink},
  data() {
    return {
      messages: [],
      pageData: {},
      headerRowStyle: {},
    }
  },
  computed: {
    ...mapState('config', ["config"]),
  },
  methods: {
    ...mapActions('messages', [`listMessages`]),
    rowStyle({row, rowIndex}) {
      const {style} = this.config
      const {rowColor1, rowColor2, textColor} = style
      if (rowIndex % 2 === 0) {
        return {
          "background-color": rowColor1,
          color: textColor,
        }
      }
      return {
        "background-color": rowColor2,
        color: textColor,
      }
    },
  },
  async mounted() {
    const data = await this.listMessages({page: 1, force: false})
    this.messages = data.messages
    this.pageData = data.pageData

    const {style} = this.config
    const {rowColor2, textColor} = style
    this.headerRowStyle = {
      "background-color": rowColor2,
      color: textColor,
    }
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>