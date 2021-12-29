<template>
  <div>
    <el-badge
        v-if="replies.length+pm.length+approbation.length>0"
        :value="unread.total"
        :type="unread.total>0?'danger':'success'"
        style="position: fixed; bottom: 0; left: 0;">
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
      <el-button size="small" type="danger" @click="clearNotices">清空信息</el-button>

      <el-tabs type="border-card">
        <el-tab-pane :disabled="replies.length===0" :label="`回复(${unread.replies})`">
          <div class="tabs-pane">
            <el-scrollbar>
              <div v-for="m in replies" :class="m.unread?'unread':''" @click="m.unread=false">
                <span>{{ m.timestamp.value.substring(m.timestamp.value.indexOf("-") + 1) }}</span>
                &nbsp;
                <nga-user-link :text="m.user.from.name" :uid="m.user.from.uid" disabled/>
                &nbsp;
                <span v-if="m.type==='对回复'">
              <my-router-link :style="{color:'red'}" :to="{name:'单个回复',params:{pid:m.reply.from}}">[回复]</my-router-link>
              了你在主题
              <my-router-link :style="{color:'blue'}" :to="{name:'回复列表',params:{tid:m.thread.tid,page:m.thread.page}}">
                {{ m.thread.subject.substring(0, Math.min(m.thread.subject.length, 15)) }}
              </my-router-link>
              的
              <my-router-link :style="{color:'red'}" :to="{name:'单个回复',params:{pid:m.reply.to}}">[回复]</my-router-link>

            </span>
                <span v-if="m.type==='@你'">
              在主题
               <my-router-link :style="{color:'blue'}" :to="{name:'回复列表',params:{tid:m.thread.tid,page:m.thread.page}}">
                {{ m.thread.subject.substring(0, Math.min(m.thread.subject.length, 15)) }}
              </my-router-link>
              的
                            <my-router-link :style="{color:'red'}" :to="{name:'单个回复',params:{pid:m.reply.from}}">[回复]</my-router-link>
@了你
             </span>
                <span v-if="m.type==='送礼物'">
              对你在主题
               <my-router-link :style="{color:'blue'}" :to="{name:'回复列表',params:{tid:m.thread.tid,page:m.thread.page}}">
                {{ m.thread.subject.substring(0, Math.min(m.thread.subject.length, 15)) }}
              </my-router-link>
              的
              <my-router-link :style="{color:'red'}" :to="{name:'单个回复',params:{pid:m.reply.to}}">[回复]</my-router-link>
              赠送了礼物
            </span>
                <span v-if="m.type==='对主题'">
               <my-router-link :style="{color:'red'}" :to="{name:'单个回复',params:{pid:m.reply.from}}">[回复]</my-router-link>
              了你的主题
                <my-router-link :style="{color:'blue'}" :to="{name:'回复列表',params:{tid:m.thread.tid,page:m.thread.page}}">
                {{ m.thread.subject.substring(0, Math.min(m.thread.subject.length, 15)) }}
              </my-router-link>
            </span>
              </div>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="pm.length===0" :label="`私信(${unread.pm})`">
          <div class="tabs-pane">
            <el-scrollbar>
              <div v-for="m in pm" :class="m.unread?'unread':''" @click="m.unread=false">
                <span>{{ m.timestamp.value.substring(m.timestamp.value.indexOf("-") + 1) }}</span>
                &nbsp;
                <nga-user-link :text="m.from.name" :uid="m.from.uid" disabled/>
                &nbsp;
                {{ m.type }}

                <el-link :href="`https://bbs.nga.cn/nuke.php?func=message#mid=${m.mid}`" target="_blank">查看</el-link>
              </div>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane :disabled="approbation.length===0" :label="`赞踩(${unread.approbation})`">
          <div class="tabs-pane">
            <el-scrollbar>
              <div v-for="m in approbation" :class="m.unread?'unread':''" @click="m.unread=false">
                主题
                <my-router-link :style="{color:'blue'}" :to="{name:'回复列表',params:{tid:m.thread.tid,page:m.thread.page}}">
                  {{ m.thread.subject.substring(0, Math.min(m.thread.subject.length, 15)) }}
                </my-router-link>
                的
                <my-router-link :style="{color:'red'}" :to="{name:'单个回复',params:{pid:m.reply.to}}">[回复]</my-router-link>
                赞踩数更新了
              </div>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>


    </el-drawer>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {Message} from "@element-plus/icons"
import NgaUserLink from "@/components/nga/user/nga-user-link";
import MyRouterLink from "@/components/my/my-router-link";
import {ElMessage, ElMessageBox} from "element-plus";

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
      },
      timer: '',
    }
  },
  components: {MyRouterLink, NgaUserLink, Message},
  computed: {
    ...mapState('notice', [`replies`, `pm`, `approbation`])
  },
  methods: {
    ...mapActions('notice', [`updateNotice`, `clearNotice`]),
    clearNotices() {
      ElMessageBox.confirm(
          `确认清空所有提示？：`,
          '确认清空',
          {
            confirmButtonText: '清空',
            cancelButtonText: '取消',
            type: '确认清空',
          }
      ).then(() => {
        this.clearNotice().then(res => {
          ElMessage.success(res[0])
          this.updateUnread()
          this.showDrawer = false
        })
      }).catch(reason => {
        ElMessage.info("已取消")
        console.log(reason)
      })
    },
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
    this.timer = setInterval(() => {
      this.update()
    }, 30 * 1000)
  },
  unmounted() {
    clearInterval(this.timer)
  },
  watch: {
    $route() {
      this.showDrawer = false
    }
  },
  props: {},
}

</script>

<style scoped>
.tabs-pane {
  height: 300px
}

.unread {
  font-weight: bold
}
</style>