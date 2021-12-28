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

      <el-row
          v-for="(row,i) in replies"
          :id="'L'+row.level"
          :key="i"
      >
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
                  <el-tooltip effect="light">
                    <template #content>
                      <el-button type="primary" size="small"
                                 v-clipboard:copy="row.pid"
                                 v-clipboard:error="onError"
                                 v-clipboard:success="onCopy"
                      >复制PID
                      </el-button>
                      <el-button type="primary" size="small"
                                 v-clipboard:copy="row.level"
                                 v-clipboard:error="onError"
                                 v-clipboard:success="onCopy"
                      >复制楼层号
                      </el-button>

                      <div style="margin-top: 3px">
                        <el-button size="small"
                                   type="primary"
                                   @click="open(`https://bbs.nga.cn/read.php?pid=${row.pid}&to`)">打开官方地址</el-button></div>
                    </template>
                    <el-tag size="small">#{{ row.level }}</el-tag>
                  </el-tooltip>
                  <nga-score-tag :reply="row"/>
                  <el-tag size="small" v-if="row.timestamp">{{row.timestamp.post}}</el-tag>

                </span>
                <!--                额外操作-->
                <el-button class="button" type="text">1</el-button>
              </div>
            </template>


            {{ row.content }}


          </el-card>


          <!--        回复框-->
          <!--          todo 热评区-->
          <!--          todo 评论区-->
          <!--          todo 签名区-->
        </el-col>

      </el-row>

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
import {ElMessage} from "element-plus";

export default {
  name: "nga-read-table",
  components: {NgaScoreTag, NgaReadUserCard},

  data() {
    return {
      currentPage: 1,
      pageSize: 100,
      total: 100,
    }
  },
  methods: {
    open(url) {
      window.open(url)
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
    },
    onCopy() {
      ElMessage.success("复制成功")
    },
    onError(e) {
      ElMessage.error("复制失败")
      console.error(e)
    },
  },
  mounted() {
    this.update()
  },
  watch: {
    pageData(e) {
      this.update(e)
    }
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
  },
}

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card {
  --el-card-padding: 5px;
}
</style>