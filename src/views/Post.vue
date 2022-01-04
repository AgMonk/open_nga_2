<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h2>::{{ title[params.action] }}::</h2>
    </el-header>

    <el-main>
      <nga-post-ui v-if="showPostUi"
                   :attachs="preData.attachs"
                   :auth="preData.auth"
                   :content="preData.content"
                   :fid="preData.forum.fid"
                   :preParam="params"
                   focus/>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {postRequest} from "@/assets/request/post-request";
import NgaPostUi from "@/components/nga/post/nga-post-ui";

export default {
  name: "Post",
  components: {NgaPostUi},
  data() {
    return {
      title: {
        "new": "发帖",
        quote: "引用",
        reply: "回复",
        modify: "编辑",
      },
      params: {},
      //预请求结果
      preData: {},
      showPostUi: false,
    }
  },
  methods: {},
  async mounted() {
    this.params = Object.assign({}, this.$route.query, this.$route.params)
    this.preData = await postRequest(this.params).catch(reason => {
      console.error(reason)
      history.back()
    })
    console.log(this.preData)
    if (this.preData) {
      this.showPostUi = true;
    }
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>