<template>
  <el-container direction="vertical">
    <!--<el-container direction="horizontal">-->
    <!--<el-header></el-header>-->

    <el-main>
      <el-pagination v-if="pageData && clientMode==='PC端'"
                     :current-page.sync="currentPage"
                     :layout="(clientMode==='PC端'?'total':'')+',prev, pager, next,jumper'"
                     :page-size="pageSize"
                     :pager-count="clientMode==='PC端'?5:3"
                     :total="total"
                     @current-change="currentChange"
      />
      <span v-if="pageData && clientMode==='PC端'">
        <el-input v-model="destLevel" class="no-number" size="small" style="width:100px" type="number" />
        <el-button size="small" type="success" @click="jumpLevel">跳转楼层</el-button>
      </span>

      <!--回复列表-->
      <div v-for="(row,i) in replies" :id="'P'+row.pid">
        <el-row :id="'L'+row.level" :key="i" :style="getRowStyle()({rowIndex:i})">
          <!--用户卡片-->
          <el-col v-if="clientMode==='PC端'" :span="6">
            <nga-read-user-card :uid="row.authorid" />
          </el-col>
          <!--回复内容-->
          <el-col :span="clientMode==='PC端'?18:24">
            <el-card class="box-card" style="height:100%">
              <template #header>
                <nga-reply-header-pc v-if="clientMode==='PC端'" :row="row" :thread="thread" />
                <nga-read-user-card-mobile v-if="clientMode==='移动端'" :uid="row.authorid" />
              </template>

              <div :style="getRowStyle()({rowIndex:i})">
                <h3 v-if="row.subject" style="text-align: left">{{ unEscape(row.subject) }}</h3>
                <nga-reply-header-mobile :row="row" />
                <nga-content :content="row.content" :mode="row.mode" :seed="row.seed" />
                <nga-reply-footer-mobile v-if="row.authorid && !(''+row.authorid).includes('未知用户')"
                                         :row="row"
                                         :thread="thread"
                />
              </div>


              <div v-if="row.hotReply && row.hotReply.length>0" id="热评区">
                <el-divider content-position="left"><span class="divider">热评区({{ row.hotReply.length }})</span></el-divider>
                <div v-for="(hot,i) in row.hotReply">
                  <nga-comment-card :contentStyle="getRowStyle()({rowIndex:i})" :reply="hot" :thread="thread" />
                </div>
              </div>
              <div v-if="row.comment && row.comment.length>0" id="评论区">
                <el-divider content-position="left"><span class="divider">评论区({{ row.comment.length }})</span></el-divider>
                <div v-for="(hot,i) in row.comment">
                  <nga-comment-card :contentStyle="getRowStyle()({rowIndex:i})" :reply="hot" :thread="thread" />
                </div>
              </div>
              <div v-if="row.attachs && row.attachs.length>0" id="附件区" style="text-align: left">
                <el-divider content-position="left">附件区({{ row.attachs.length }})</el-divider>
                <nga-attach-tag v-for="img in row.attachs" :data="img" />
              </div>
              <div v-if="row.gifts" style="text-align: left">
                <el-divider v-if="clientMode==='PC端'" content-position="left"><span class="divider">礼物</span></el-divider>
                <span v-for="item in row.gifts">
                  <el-image :src="`/items/5_${item.id}.png`" :style="giftSize[clientMode]" />
                  X {{ item.count }}
                </span>
              </div>
              <div v-if="row.vote" id="投票区" style="text-align: left">
                <el-divider v-if="clientMode==='PC端'" content-position="left"><span class="divider">投票区</span></el-divider>
                <nga-vote-config :config="row.vote.config" />

                <nga-vote-table v-if="row.vote" :tid="thread.tid" :vote="row.vote" />

              </div>
              <!--              <div v-if="users[row.authorid] && users[row.authorid].signature" style="text-align: left">-->
              <!--                <el-collapse>-->
              <!--                  <el-collapse-item title="[签名区]">-->
              <!--                    <nga-signature :uid="row.authorid"/>-->
              <!--                  </el-collapse-item>-->
              <!--                </el-collapse>-->
              <!--              </div>-->
            </el-card>
          </el-col>

        </el-row>
      </div>
      <el-pagination v-if="pageData && clientMode==='PC端'"
                     :current-page.sync="currentPage"
                     :layout="(clientMode==='PC端'?'total':'')+',prev, pager, next,jumper'"
                     :page-size="pageSize"
                     :pager-count="clientMode==='PC端'?5:3"
                     :total="total"
                     @current-change="currentChange"
      />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import NgaReadUserCard from "@/components/nga/read/nga-read-user-card";
import {keypressEvent, scrollToId} from "@/assets/utils/DomUtils";
import {ElMessage, ElMessageBox} from "element-plus";
import {report} from "@/assets/request/nuke-request";
import NgaCommentCard from "@/components/nga/read/nga-comment-card";
import NgaContent from "@/components/nga/content/nga-content";
import NgaAttachTag from "@/components/nga/read/nga-attach-tag";
import {mapGetters, mapState} from "vuex";
import {unEscape} from "@/assets/utils/StringUtils";
import NgaReadUserCardMobile from "@/components/nga/read/nga-read-user-card-mobile";
import NgaReplyFooterMobile from "@/components/nga/read/nga-reply-footer-mobile";
import NgaReplyHeaderMobile from "@/components/nga/read/nga-reply-header-mobile";
import NgaReplyHeaderPc from "@/components/nga/read/nga-reply-header-pc";
import NgaVoteConfig from "@/components/nga/read/nga-vote-config";
import NgaVoteTable from "@/components/nga/read/nga-vote-table";

export default {
  name: "nga-read-table",
  components: {
    NgaVoteTable,
    NgaVoteConfig,
    NgaReplyHeaderPc,
    NgaReplyFooterMobile,
    NgaReplyHeaderMobile,
    NgaReadUserCardMobile,
    NgaAttachTag,
    NgaContent,
    NgaCommentCard,
    NgaReadUserCard
  },
  computed: {
    ...mapState('client', [`clientMode`]),
    ...mapState('users', ["users"])
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 100,
      total: 100,
      totalPage: 100,
      destLevel: '',
      giftSize: {
        'PC端': {
          'max-width': '32px',
          'max-height': '32px',
        },
        '移动端': {
          'max-width': '16px',
          'max-height': '16px',
        },

      }
    }
  },
  methods: {
    ...mapGetters('config', [`getHeaderRowStyle`, `getRowStyle`]),
    unEscape,
    report({tid, pid}) {
      ElMessageBox.prompt('请填写理由', '举报理由', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(({value}) => {
        report({tid, pid, info: value}).then(res => {
          ElMessage.success(res.data["0"])
        })
      }).catch(reason => {
        ElMessage.info("已取消")
        console.log(reason)
      })
    },
    jumpLevel() {
      if (!this.destLevel || isNaN(this.destLevel)) {
        ElMessage.error(`无效的楼层 ${this.destLevel}`)
        return
      }
      if (this.destLevel > this.total - 1) {
        ElMessage.error(`不存在的楼层 ${this.destLevel}`)
        return
      }
      const level = parseInt(this.destLevel)
      const page = Math.floor(level / this.pageSize) + (((level + 1) % this.pageSize > 0) ? 1 : 0);
      this.$router.push({
        name: '回复列表',
        params: {
          tid: this.thread.tid,
          page,
        },
        hash: `#L${level}`
      })
    },
    currentChange(e) {
      const {name, params, query} = this.$route
      params.page = e;
      this.currentPage = e
      this.$router.push({name, params, query})
    },
    update(e = this.pageData) {
      this.currentPage = parseInt(e.currentPage)
      this.total = parseInt(e.total)
      this.pageSize = parseInt(e.pageSize)
      this.totalPage = parseInt(e.totalPage)
    },
    keypress(e) {
      const methods = {
        a: () => this.currentChange(Math.max(this.currentPage - 1, 1)),
        d: () => this.currentChange(Math.min(this.currentPage + 1, this.totalPage)),
        A: () => this.currentChange(1),
        D: () => this.currentChange(this.totalPage),
      }
      keypressEvent(e, methods)
    },
  },
  updated() {
    const hash = this.$route.hash.substring(1)
    this.$nextTick(() => {
      setTimeout(() => {
        const success = scrollToId(hash)
        if (hash && !success) {
          console.error(`滚动不成功 hash = ${hash}`)
          const pattern = /^P(\d+)$/
          const match = pattern.exec(hash)
          if (match) {
            console.log(match)

            let clearHash = true;

            setTimeout(() => {
              if (clearHash) {
                this.$router.push({hash: ''})
              }
            }, 30 * 1000)

            ElMessageBox.confirm("滚动不成功，似乎是卡审核了，是否直接回复该回复？", {
              title: '滚动不成功',
              type: 'warning',
              confirmButtonText: '回复',
              cancelButtonText: '取消',
            }).then(() => {
              const to = {name: '发帖', params: {action: 'reply'}, query: {tid: this.thread.tid, pid: match[1]}}
              this.$router.push(to);
              clearHash = false;
            }).catch(reason => {
              ElMessage.info("已取消")
              console.log(reason)
              clearHash = false;
              this.$router.push({hash: ''})
            })
          }
        }
      }, 200)
    })
  },
  mounted() {
    this.update()
    document.addEventListener('keypress', this.keypress)
  },
  unmounted() {
    document.removeEventListener('keypress', this.keypress)
  },
  watch: {
    pageData(e) {
      this.update(e)
    },
  },
  props: {
    replies: {
      type: Object,
      required: true,
    },
    pageData: {
      type: Object,
      required: true,
    },
    thread: {
      type: Object,
      required: true,
    },

  },
}

</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
  background-color: rgb(0 0 0 / 0%);
}

.el-card {
  --el-card-padding: 5px;
  background-color: rgb(0 0 0 / 0%);
}

.divider {
  color: red;
  font-weight: bold;
}

.el-collapse {
  --el-collapse-border-color: #91adef;
  --el-collapse-header-height: 30px;
  --el-collapse-header-bg-color: #9afdda;
}

.el-pagination {
  --el-pagination-bg-color: rgb(0 0 0 / 0%);
  --el-pagination-button-disabled-bg-color: rgb(0 0 0 / 0%);
}

.el-pager li {
  background: rgb(0 0 0 / 0%);
}

.el-main {
  --el-main-padding: 0;
  overflow-y: hidden;
}
</style>