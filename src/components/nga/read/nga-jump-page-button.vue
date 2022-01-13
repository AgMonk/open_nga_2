<!--跳页按钮-->
<template>
  <span style="margin-right: 10px">
    <el-button size="small" type="success" @click="show=true">
      {{ pageData.currentPage }}/{{ pageData.totalPage }}
    </el-button>

    <el-dialog v-model="show" append-to-body title="跳转到页" width="80%">
      <el-container>
        <el-header height="350px">
          <el-row>
            <el-col v-for="i in Math.min(36,pageData.totalPage)" :span="6" style="margin-top: 3px">
              <el-button size="small" type="primary" @click="jump(i)">{{ i }}</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-footer style="text-align: center">
          <div style="margin-bottom: 3px">
            <el-input v-model="level" size="small" style="width:100px" />
            <el-button size="small" type="success" @click="jump(level)">跳转</el-button>
          </div>
          <el-button size="small" type="primary" @click="jump(1)">首</el-button>
          <!--          <el-button size="small" type="primary" @click="jump(pageData.currentPage-1)">上</el-button>-->
          <!--          <el-button size="small" type="primary" @click="jump(pageData.currentPage+1)">下</el-button>-->
          <el-button size="small" type="primary" @click="jump(pageData.totalPage)">末</el-button>
        </el-footer>
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
      level: "",
    }
  },
  computed: {},
  methods: {
    jump(page) {
      page = page < 1 ? 1 : page;
      page = page > this.pageData.totalPage ? this.pageData.totalPage : page;
      this.$router.push({params: {page}})
      this.show = false;
    }
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