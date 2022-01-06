<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <!--      todo 下一页-->

    </el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";

export default {
  name: "MessageRead",
  data() {
    return {}
  },
  computed: {},
  methods: {
    ...mapActions('messages', [`readMessage`]),
    update(mid, page, force = false) {
      this.readMessage({mid, page, force}).then(res => {
        console.log(res)
      })
    }
  },
  mounted() {
    const {mid, page} = this.$route.params
    setTitle('短消息内容')
    this.update(mid, page)
  },
  watch: {
    $route(to) {
      if (to.name === '短消息阅读') {
        this.update(to.params.mid, to.params.page)
      }
    }
  },
  props: {
    mid: {},
    page: {},
  },
}

</script>

<style scoped>

</style>