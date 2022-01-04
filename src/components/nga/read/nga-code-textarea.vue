<template>
  <!--  <el-container direction="horizontal">-->
  <div style="border: 1px solid black;background-color: #78e1b3">
    <h4 style="margin:1px 0;">lang = {{ lang }}</h4>
    <div class="code-area">
      <pre><code :class="clazz">{{ data }}</code></pre>
    </div>
  </div>

</template>

<script>
import {unEscape} from "@/assets/utils/StringUtils";
import {ElMessage} from "element-plus";
import MyCopyButton from "@/components/my/my-copy-button";
import Prism from "prismjs"; //引入插件

export default {
  name: "nga-code-textarea",
  components: {MyCopyButton},
  data() {
    return {
      data: [],
      clazz: '',
    }
  },
  methods: {
    unEscape,
    onCopy() {
      ElMessage.success("复制成功")
    },
    onError(e) {
      ElMessage.error("复制失败")
      console.error(e)
    },
    update(e) {
      const lang = this.lang ? this.lang : 'js'
      this.data = unEscape(this.code)
      const clazz = ['line-numbers', 'copy-to-clipboard'];
      clazz.push(`lang-${lang}`)

      this.clazz = clazz.join(' ')
      this.$nextTick(() => {
        Prism.highlightAll()
      })
    },
  },
  mounted() {
    this.update(this.code)
  },
  watch: {
    code(to) {
      this.update(to)
    }
  },
  props: {
    code: {type: String, required: true},
    lang: {type: String},
  },
}

</script>

<style scoped>

pre {
  margin: 0;
}

</style>