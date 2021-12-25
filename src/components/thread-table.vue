<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-pagination v-if="pageData"
                     :current-page.sync="currentPage"
                     :pager-count="5"
                     layout="total,prev, pager, next,jumper"
                     @current-change="currentChange"
                     :page-size="pageSize"
                     :total="total"
      />
      <!--
                           :page-size="pageData.pageSize"

      -->

      <!--      layout="total,prev, pager, next,jumper"-->
      <!--      layout="total, sizes, prev, pager, next, jumper" -->
    </el-header>

    <el-main>
      <el-table :data="threads" style="width: 100%">
        <el-table-column label="#" width="40px">
          <template #default="s">
            {{ s.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="回复" prop="replies" width="70px">
          <template #default="s">
            <span v-if="s.row.mirror && ['版面','合集'].includes(s.row.mirror.type)">
              {{s.row.mirror.type}}
            </span>
            <span v-else>{{ s.row.replies }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="主题">
          <template #default="s">
            <thread-link :data="s.row" />
          </template>
        </el-table-column>
        <el-table-column prop="author.name" label="作者" width="180"/>
        <el-table-column prop="lastposter" label="最后回复" width="180"/>
      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import ThreadLink from "@/components/thread-link";
export default {
  name: "thread-table",
  components: {ThreadLink},
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
    threads: {
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