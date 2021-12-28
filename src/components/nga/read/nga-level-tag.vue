<template>
  <el-tooltip effect="light">
    <template #content>
      <el-button type="primary" size="small"
                 v-clipboard:copy="reply.pid"
                 v-clipboard:error="onError"
                 v-clipboard:success="onCopy"
      >复制PID
      </el-button>
      <el-button type="primary" size="small"
                 v-clipboard:copy="reply.level"
                 v-clipboard:error="onError"
                 v-clipboard:success="onCopy"
      >复制楼层号
      </el-button>

      <div style="margin-top: 3px">
        <el-button size="small"
                   type="primary"
                   @click="open(`https://bbs.nga.cn/read.php?pid=${row.pid}&to`)">打开官方地址
        </el-button>
      </div>
    </template>
    <el-tag size="small">#{{ reply.level }}</el-tag>
  </el-tooltip>
</template>
<script>
import {ElMessage} from "element-plus";

export default {
  name: 'nga-agree-button',
  methods: {
    open(url) {
      window.open(url)
    },
    onCopy() {
      ElMessage.success("复制成功")
    },
    onError(e) {
      ElMessage.error("复制失败")
      console.error(e)
    },
  },
  props: {
    reply:{
      type:Object,
      required: true,
    }
  },
}
</script>
