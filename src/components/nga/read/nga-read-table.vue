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
<!--          todo header 楼层号，赞踩，时间 对楼层操作-->
          <!--        回复框-->
          {{row.content}}
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
export default {
  name: "nga-read-table",
  components: {NgaReadUserCard},

  data() {
    return {
      currentPage: 1,
      pageSize: 100,
      total: 100,
    }
  },
  methods: {
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
    }
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

</style>