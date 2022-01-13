<!--跳页按钮-->
<template>
  <span style="margin-right: 10px">
    <el-button size="small" type="success" @click="show=true">
      {{ pageData.currentPage }}/{{ pageData.totalPage }}
    </el-button>

    <el-dialog v-model="show" append-to-body title="跳转到页" width="90%">
      <el-container>
        <el-header height="200px">
          <el-pagination :current-page.sync="pageData.currentPage"
                         :page-size="pageData.pageSize"
                         :pager-count="21"
                         :total="pageData.total"
                         layout="pager, jumper"
                         small
                         @current-change="currentChange"
          />
        </el-header>
      </el-container>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: "nga-jump-page-button",
  data() {
    return {
      show: false,
    }
  },
  computed: {},
  methods: {
    currentChange(e) {

    },
  },
  mounted() {
  },
  watch: {},
  props: {
    pageData: {type: Object, required: true},
  },
}

</script>

<style scoped>

</style>