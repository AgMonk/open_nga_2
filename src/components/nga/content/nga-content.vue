<template>
  <div style="text-align: left">
    <nga-content-render :data="contentArray"/>
  </div>

</template>

<script>
import {unEscape} from "@/assets/utils/StringUtils";
import {parseBbsCode} from "@/assets/nga/bbsCodeParser";
import NgaContentRender from "@/components/nga/content/nga-content-render";

export default {
  name: "nga-content",
  components: {NgaContentRender},
  data() {
    return {
      contentArray: [],
    }
  },
  methods: {
    unEscape,
    parse(s) {
      this.contentArray = parseBbsCode(s)
      // console.log(this.contentArray)
      return this.contentArray
    }
  },
  mounted() {
    this.parse(this.content)
    console.log(this.parse(this.content))
  },
  watch: {
    content(s) {
      this.parse(s)
    }
  },
  props: {
    content: {required: true}
  },
}

</script>

<style scoped>

</style>