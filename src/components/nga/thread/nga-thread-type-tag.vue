<!--主题状态标签-->
<template>
  <span v-if="type">
    <my-tag-with-tooltip v-if="type.freeEdit" tooltip="编辑时间不受限制" size="small">编辑</my-tag-with-tooltip>
    <my-tag-with-tooltip v-if="type.hidden" tooltip="被隐藏" size="small" type="danger"><b>隐藏</b></my-tag-with-tooltip>
    <my-tag-with-tooltip v-if="type.locked" tooltip="不允许编辑和回复" size="small" type="danger"><b>锁定</b></my-tag-with-tooltip>
    <my-tag-with-tooltip v-if="type.notVerified" tooltip="经过了人工审核，且被判定为不通过" size="small" type="danger"><b>审核不通过</b></my-tag-with-tooltip>
    <my-tag-with-tooltip v-if="type.verifying" tooltip="正在人工审核.." size="small" type="danger"><b>审核中</b></my-tag-with-tooltip>
    <my-tag-with-tooltip v-if="type.selfReply" tooltip="主题只能作者自己回复" size="small" type="success">自回</my-tag-with-tooltip>
    <my-tag-with-tooltip v-if="type.isComment" size="small" tooltip="这是一条评论" type="danger">评论</my-tag-with-tooltip>
  </span>
</template>

<script>
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";

export default {
  name: "nga-thread-type-tag",
  components: {MyTagWithTooltip},
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    type: {type: Object}
  },
}

</script>

<style scoped>

</style>