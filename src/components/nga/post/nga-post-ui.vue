<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>

    <el-main>
      <el-input id="nga-post-textarea"
                v-model="postParams.content"
                :rows="!postParams.content?5:Math.max(postParams.content.split(`\n`).length+1,5)" placeholder="正文"
                style="margin-bottom: 5px"
                type="textarea"
                @keyup.enter.ctrl="sendPost"
      />

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {postRequest} from "@/assets/request/post-request";

export default {
  name: "nga-post-ui",
  data() {
    return {
      postParams: {
        subject: "",
        content: "",
        attachments: [],
        attachmentsCheck: [],
        comment: false,
      }
    }
  },
  methods: {
    keypress(e) {
      console.log(e)
    },
    async sendPost() {
      const data = {
        ...this.preParam,
        step: 2,
      };
      const {subject, comment, content, attachments, attachmentsCheck} = this.postParams
      data.post_subject = subject;
      data.post_content = content;
      if (attachments && attachments.length > 0) {
        data.attachments = attachments.join('\t')
      }
      if (attachmentsCheck && attachmentsCheck.length > 0) {
        data.attachments_check = attachmentsCheck.join('\t')
      }
      if (comment) {
        data.comment = 1
      }
      const res = await postRequest(data)
      console.log(res)
    },
  },
  mounted() {
    this.postParams.content = this.content

    if (this.focus) {
      document.getElementById('nga-post-textarea').focus()
    }
  },
  watch: {},
  props: {
    preParam: {type: Object, required: true},
    content: {},
    auth: {},
    focus: {type: Boolean, default: false},
  },
}

</script>

<style scoped>

</style>