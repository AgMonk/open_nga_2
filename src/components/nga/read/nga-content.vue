<template>
  <div style="text-align: left">
    {{ content }}
    <!--    {{unEscape(content)}}-->
    <!--    todo 解析 渲染-->
  </div>

</template>

<script>
import {unEscape} from "@/assets/utils/StringUtils";
import {parseBbsCode} from "@/assets/nga/bbsCodeParser";

export default {
  name: "nga-content",
  data() {
    return {
      contentArray: [],
    }
  },
  methods: {
    unEscape,
    parse(s) {
      this.contentArray = parseBbsCode(s)
      return this.contentArray
    }
  },
  mounted() {
    console.log(this.parse(this.content))
  },
  watch: {
    content(s) {
      this.parse(s)
    }
  },
  props: {
    content: {type: String, required: true}
  },
}

</script>

<style scoped>

</style>