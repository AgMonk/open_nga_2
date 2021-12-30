<template>
  <my-tag-with-tooltip effect="light">
    <template #tooltip>
      <el-button type="primary" size="small"
                 v-if="reply.pid"
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
        <el-button v-clipboard:copy='getBbsCode(reply)' v-clipboard:error="onError"
                   v-clipboard:success="onCopy"
                   size="small"
                   type="primary"
        >复制BbsCode
        </el-button>
        <el-button size="small"
                   type="primary"
                   @click="reply.pid?open(`https://bbs.nga.cn/read.php?pid=${reply.pid}&to`):open(`https://bbs.nga.cn/read.php?tid=${reply.tid}`)">打开官方地址
        </el-button>

      </div>
    </template>
    #{{ reply.level }}
  </my-tag-with-tooltip>
</template>
<script>
import {ElMessage} from "element-plus";
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";

export default {
  name: 'nga-agree-button',
  components: {MyTagWithTooltip},
  methods: {
    getBbsCode(reply) {
      if (reply.level === 0) {
        return `[tid=${reply.tid}]这个帖子[/tid]`
      }
      return `[pid=${reply.pid}]${reply.level}楼[/pid]`
    },
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
