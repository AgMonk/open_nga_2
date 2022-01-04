<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <el-pagination v-if="pageData"
                     :current-page.sync="currentPage"
                     :pager-count="5"
                     layout="total,prev, pager, next,jumper"
                     @current-change="currentChange"
                     :page-size="pageSize"
                     :total="total"
      />
      <el-input v-model="destLevel" size="small" style="width:100px"/>
      <el-button size="small" type="success" @click="jumpLevel">跳转楼层</el-button>

      <div v-for="(row,i) in replies" :id="'P'+row.pid">
        <el-row :id="'L'+row.level" :key="i">
          <el-col :span="6">
            <!--        用户卡片-->
            <nga-read-user-card :uid="row.authorid"/>
          </el-col>
          <el-col :span="18">
            <el-card class="box-card" style="height:100%">
              <template #header>
                <div class="card-header">
                  <!--                赞踩按钮-->
                  <span>
                  <nga-level-tag :reply="row"/>
                  <nga-score-tag :reply="row"/>
                  <my-tag-with-tooltip disabled v-if="row.timestamp">{{ row.timestamp.post }}</my-tag-with-tooltip>
                  <my-tag-with-tooltip disabled v-if="row.timestamp && row.timestamp.edit">最后编辑:{{ row.timestamp.edit }}</my-tag-with-tooltip>
                    <my-tag-with-tooltip v-if="row.reply_to" :route="{name:'单个回复',params:{pid:row.reply_to}}" disabled type="warning">
                      回复目标
                    </my-tag-with-tooltip>
                  <nga-thread-type-tag :type="row.type"/>
                    <el-tag v-if="$route.hash===`#P${row.pid}`" size="small" type="danger"><b>这个回复</b></el-tag>
                </span>

                  <span>
                    <my-router-link :to="{name:'发帖',params:{action:'quote'},query:{tid:thread.tid,pid:row.pid}}">
                          <my-tag-with-tooltip disabled text="引用"/>
                        </my-router-link>
                        <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:thread.tid,pid:row.pid}}">
                          <my-tag-with-tooltip disabled text="回复"/>
                        </my-router-link>
                    <nga-read-operation-button :fid="thread.fid" :reply="row"/>
                  </span>
                </div>
              </template>

              <div>
                <nga-content :content="row.content"/>
              </div>


              <div v-if="row.hotReply && row.hotReply.length>0" id="热评区">
                <el-divider content-position="left"><span class="divider">热评区({{ row.hotReply.length }})</span></el-divider>
                <div v-for="hot in row.hotReply">
                  <nga-comment-card :reply="hot"/>
                </div>
              </div>
              <div v-if="row.comment && row.comment.length>0" id="评论区">
                <el-divider content-position="left"><span class="divider">评论区({{ row.comment.length }})</span></el-divider>
                <div v-for="hot in row.comment">
                  <nga-comment-card :reply="hot"/>
                </div>
              </div>
              <div v-if="row.attachs && row.attachs.length>0" id="附件区" style="text-align: left">
                <el-divider content-position="left">附件区({{ row.attachs.length }})</el-divider>
                <nga-attach-tag v-for="img in row.attachs" :data="img"/>
              </div>
              <div v-if="users[row.authorid] && users[row.authorid].signature" style="text-align: left">
                <el-collapse>
                  <el-collapse-item title="[签名区]">
                    <nga-signature :uid="row.authorid"/>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-card>
          </el-col>

        </el-row>
      </div>

      <el-pagination v-if="pageData"
                     :current-page.sync="currentPage"
                     :pager-count="5"
                     layout="total,prev, pager, next,jumper"
                     @current-change="currentChange"
                     :page-size="pageSize"
                     :total="total"
      />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import NgaReadUserCard from "@/components/nga/read/nga-read-user-card";
import NgaScoreTag from "@/components/nga/read/nga-score-tag";
import NgaLevelTag from "@/components/nga/read/nga-level-tag";
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";
import MyRouterLink from "@/components/my/my-router-link";
import {Setting} from '@element-plus/icons'
import NgaThreadTypeTag from "@/components/nga/thread/nga-thread-type-tag";
import {keypressEvent, scrollToId} from "@/assets/utils/DomUtils";
import {ElMessage, ElMessageBox} from "element-plus";
import {report} from "@/assets/request/nuke-request";
import NgaCommentCard from "@/components/nga/read/nga-comment-card";
import NgaReadOperationButton from "@/components/nga/read/nga-read-operation-button";
import NgaContent from "@/components/nga/read/nga-content";
import NgaAttachTag from "@/components/nga/read/nga-attach-tag";
import NgaSignature from "@/components/nga/read/nga-signature";
import {mapState} from "vuex";

export default {
  name: "nga-read-table",
  components: {
    NgaSignature,
    NgaAttachTag,
    NgaContent, NgaReadOperationButton, NgaCommentCard, NgaThreadTypeTag, MyRouterLink, MyTagWithTooltip, NgaLevelTag, NgaScoreTag, NgaReadUserCard, Setting
  },
  computed: {
    ...mapState('users', ["users"])
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 100,
      total: 100,
      totalPage: 100,
      destLevel: '',
    }
  },
  methods: {
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
      setTimeout(() => scrollToId(hash), 200)
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

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
}

.el-card {
  --el-card-padding: 5px;
}

.divider {
  color: red;
  font-weight: bold;
}
</style>