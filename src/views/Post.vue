<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <span v-if="params.action==='new'">发帖</span>
      <span v-if="params.action==='quote'">引用</span>
      <span v-if="params.action==='reply'">回复</span>
      <span v-if="params.action==='modify'">编辑</span>
    </el-header>

    <el-main>
      <nga-post-ui v-if="showPostUi" :auth="preData.auth" :content="preData.content" :preParam="params" focus/>
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
      params: {},
      //预请求结果
      preData: {},
      showPostUi: false,
    }
  },
  methods: {},
  async mounted() {
    this.params = Object.assign({}, this.$route.query, this.$route.params)
    this.preData = await postRequest(this.params)
    console.log(this.preData)
    this.showPostUi = true;
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>