<template>
  <div>
    <el-badge :type="unread.total===0?'success':'danger'" :value="unread.total" style="position: fixed; bottom: 0; left: 0;">
      <el-button @click="showDrawer=true;update()">
        <el-icon>
          <message/>
        </el-icon>
      </el-button>
    </el-badge>
    <el-drawer
        v-model="showDrawer"
        append-to-body
        close-on-click-modal
        close-on-press-escape
        size="60%"
        title="提示信息"
    >
      <el-button size="small" type="danger" @click="allRead">全部已读</el-button>

      <el-tabs type="border-card">
        <el-tab-pane :disabled="unread.replies===0" :label="`回复(${unread.replies})`">

        </el-tab-pane>
        <el-tab-pane :disabled="unread.pm===0" :label="`私信(${unread.pm})`">

        </el-tab-pane>
        <el-tab-pane :disabled="unread.approbation===0" :label="`赞踩(${unread.approbation})`">

        </el-tab-pane>
      </el-tabs>


    </el-drawer>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {Message} from "@element-plus/icons"

export default {
  name: "Notice",
  data() {
    return {
      showDrawer: false,
      activeName: 'replies',
      unread: {
        replies: 0,
        pm: 0,
        approbation: 0,
        total: 0,
      }
    }
  },
  components: {Message},
  computed: {
    ...mapState('notice', [`replies`, `pm`, `approbation`])
  },
  methods: {
    ...mapActions('notice', [`updateNotice`]),
    allRead() {
      this.replies.forEach(i => i.unread = false)
      this.pm.forEach(i => i.unread = false)
      this.approbation.forEach(i => i.unread = false)
      this.updateUnread()
    },
    updateUnread() {
      this.unread.replies = this.replies.filter(i => i.unread).length
      this.unread.pm = this.pm.filter(i => i.unread).length
      this.unread.approbation = this.approbation.filter(i => i.unread).length
      this.unread.total = this.unread.replies + this.unread.pm + this.unread.approbation
    },
    async update() {
      await this.updateNotice();
      this.updateUnread()
    },
  },
  mounted() {
    this.update()
    setInterval(() => {
      this.update()
    }, 30 * 1000)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>