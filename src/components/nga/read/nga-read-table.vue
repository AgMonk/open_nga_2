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
            <!--          todo header 楼层号，时间 对楼层操作-->
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
                </span>

                  <span>
                    <my-router-link :to="{name:'发帖',params:{action:'quote'},query:{tid:thread.tid,pid:row.pid}}">
                          <my-tag-with-tooltip disabled text="引用"/>
                        </my-router-link>
                        <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:thread.tid,pid:row.pid}}">
                          <my-tag-with-tooltip disabled text="回复"/>
                        </my-router-link>
                    <el-tooltip effect="light" placement="bottom" style="margin-left: 5px">
                      <template #content>
                        <div>
                          <h4>查看</h4>
                          <my-tag-with-tooltip :route="{name:'回复列表',params:{page:1,tid:row.tid},query:{authorid:row.authorid}}" disabled text="只看TA"/>
                          <my-tag-with-tooltip :route="{name:'搜索用户发言',params:{page:1,authorid:row.authorid},query:{fid:thread.fid}}" disabled text="本版主题"/>
                          <my-tag-with-tooltip :route="{name:'搜索用户发言',params:{page:1,authorid:row.authorid},query:{fid:thread.fid,searchpost:1}}" disabled text="本版回复"/>
                          <my-tag-with-tooltip :route="{name:'搜索用户发言',params:{page:1,authorid:row.authorid}}" disabled text="用户主题"/>
                          <my-tag-with-tooltip :route="{name:'搜索用户发言',params:{page:1,authorid:row.authorid,searchpost:1}}" disabled text="用户回复"/>
                        </div>
                        <div>
                          <h4>操作</h4>
                          <my-router-link :to="{name:'发帖',params:{action:'quote'},query:{tid:thread.tid,pid:row.pid}}">
                            <my-tag-with-tooltip disabled text="引用"/>
                          </my-router-link>
                          <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:thread.tid,pid:row.pid}}">
                            <my-tag-with-tooltip disabled text="回复"/>
                          </my-router-link>
                          <!--                      todo -->
                          <my-tag-with-tooltip disabled text="举报"/>

                        </div>
                      </template>
                      <el-button class="button" type="text">
                        <el-icon>
                          <setting/>
                        </el-icon>
                      </el-button>
                    </el-tooltip>
                  </span>
                </div>
              </template>

              <div>
                {{ row.content }}
              </div>


            </el-card>


            <!--        回复框-->
            <!--          todo 热评区-->
            <!--          todo 评论区-->
            <!--          todo 签名区-->
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
import {keypressEvent, scrollMethods, scrollToId} from "@/assets/utils/DomUtils";
import {ElMessage} from "element-plus";

export default {
  name: "nga-read-table",
  components: {NgaThreadTypeTag, MyRouterLink, MyTagWithTooltip, NgaLevelTag, NgaScoreTag, NgaReadUserCard, Setting},

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
        ...scrollMethods,
      }
      keypressEvent(e, methods)
    },
  },
  updated() {
    const hash = this.$route.hash.substring(1)
    this.$nextTick(() => {
      scrollToId(hash);
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
</style>