<template>
  <div v-if="mode==='render'" class="content">
    <nga-content-render :data="contentArray" />
  </div>
  <div v-if="mode==='code'" class="content">
    <div v-for="item in code">{{ item }}</div>
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
      code: [],
    }
  },
  methods: {
    unEscape,
    parse(s) {
      this.contentArray = parseBbsCode(s)
      // console.log(this.contentArray)
      this.code = s.split('<br/>')
      return this.contentArray
    }
  },
  mounted() {
    this.parse(this.content)
    // console.log(this.parse(this.content))
  },
  watch: {
    content(s) {
      this.parse(s)
    }
  },
  props: {
    content: {required: true},
    mode: {type: String, default: 'render'},
  },
}

</script>

<style scoped>
.content {
  text-align: left
}
</style>