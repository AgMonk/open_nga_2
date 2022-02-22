<template>
  <my-tag-with-tooltip effect="light">
    <template #tooltip>
      <div>
        <el-divider content-position="left">复制:{{ reply.pid }}</el-divider>
        <my-copy-button :copy-text="reply.pid" text="PID" />
        <my-copy-button :copy-text="reply.level" text="楼层号" />
        <my-copy-button :copy-text="getBbsCode(reply)" text="BbsCode" />
      </div>
      <div style="margin-top: 3px">
        <el-divider content-position="left">打开</el-divider>
        <el-button size="small"
                   type="primary"
                   @click="reply.pid?open(`https://bbs.nga.cn/read.php?pid=${reply.pid}&to`):open(`https://bbs.nga.cn/read.php?tid=${reply.tid}`)"
        >官方地址
        </el-button>

        <el-button v-if="reply.pid!==0"
                   size="small"
                   type="primary"
                   @click="$router.push({name:'单个回复',params:{pid: reply.pid}})"
        >本回复
        </el-button>

      </div>

    </template>
    #{{ reply.level }}
  </my-tag-with-tooltip>
</template>
<script>
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";
import MyCopyButton from "@/components/my/my-copy-button";

export default {
  name: 'nga-agree-button',
  components: {MyCopyButton, MyTagWithTooltip},
  methods: {
    getBbsCode(reply) {
      if (reply.level === 0 && this.$route.name !== '单个回复') {
        return `[tid=${reply.tid}]这个帖子[/tid]`
      }
      return `[pid=${reply.pid}]这个回复[/pid]`
    },
    open(url) {
      window.open(url)
    },
  },
  props: {
    reply: {
      type: Object,
      required: true,
    }
  },
}
</script>
