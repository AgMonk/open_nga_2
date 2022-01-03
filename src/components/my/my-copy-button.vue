<template>
  <el-button v-clipboard:copy="copyText" v-clipboard:error="onError"
             v-clipboard:success="onCopy"
             :size="size"
             :type="type"
  >
    <slot v-if="this.$slots.defalut"/>
    <span v-else>{{ text }}</span>
  </el-button>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "my-copy-button",
  data() {
    return {}
  },
  methods: {
    onCopy() {
      ElMessage.success("复制成功")
    },
    onError(e) {
      ElMessage.error("复制失败")
      console.error(e)
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    copyText: {
      required: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    text: {
      type: String,
      default: '复制',
    },

  },
}

</script>

<style scoped>

</style>