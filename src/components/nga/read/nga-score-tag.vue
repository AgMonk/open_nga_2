<template>
  <el-tag size="small">
    <el-icon @click="agree(1)">
      <circle-check/>
    </el-icon>
    <span>{{ reply.score.agree }}</span>
    <span v-if="reply.score.disagree>0">/{{ reply.score.disagree }}</span>
    <el-icon @click="agree(-1)">
      <circle-close/>
    </el-icon>
  </el-tag>
</template>

<script>
import {CircleCheck, CircleClose} from "@element-plus/icons"
import {agree} from "@/assets/request/nuke-request";
import {ElMessage} from "element-plus";

export default {
  name: "nga-score-tag",
  components: {
    CircleClose, CircleCheck
  },
  data() {
    return {}
  },
  methods: {
    agree(v) {
      agree(this.reply.tid, this.reply.pid, v)
          .then(res => {
            ElMessage.success(res.message)
            this.reply.score.agree+=res.value;
          })
          .catch(res => {
            ElMessage.error(res[0])
          })
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    reply: {
      type: Object,
      required: true,
    },
  },
}

</script>

<style scoped>

</style>