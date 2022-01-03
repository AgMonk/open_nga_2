<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <h4>lang = {{ lang }}
        <el-button v-clipboard:copy="this.data.join('\n')" v-clipboard:error="onError" v-clipboard:success="onCopy" size="mini"
                   type="primary">复制代码
        </el-button>
      </h4>
      <div class="code-area">
        <div v-for="(item,i) in  data">
          <pre>{{ item }}</pre>
        </div>
      </div>
    </el-main>
  </el-container>

</template>

<script>
import {unEscape} from "@/assets/utils/StringUtils";
import {ElMessage} from "element-plus";

export default {
  name: "nga-code-textarea",
  data() {
    return {
      data: [],
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
      this.data = unEscape(this.code).split('\n')
      console.log(this.data)
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
    lang: {type: String, required: true},
  },
}

</script>

<style scoped>
.code-area {
  background-color: rgba(0, 0, 0, 0.72);
  color: white;
}

pre {
  margin: 0;
}

.line-index {
  -moz-user-select: none; /* 火狐 */
  -webkit-user-select: none; /* 谷歌 */
  -ms-user-select: none; /* IE */
  user-select: none;
  display: inline-block;
}
</style>