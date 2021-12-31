<template>
  <div style="text-align: left">
    {{ content }}
    <!--    {{unEscape(content)}}-->
    <!--    todo 解析 渲染-->
  </div>

</template>

<script>
import {unEscape} from "@/assets/utils/StringUtils";

export default {
  name: "nga-content",
  data() {
    return {}
  },
  methods: {
    unEscape
  },
  mounted() {
  },
  watch: {},
  props: {
    content: {type: String, required: true}
  },
}

</script>

<style scoped>

</style>