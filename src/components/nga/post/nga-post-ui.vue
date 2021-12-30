<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <div id="快捷按钮" style="margin-bottom: 10px">
        <template v-for="(code,i) in bbsCodeLibrary" :key="i">
          <el-select v-if="code.props" :placeholder="code.cn" class="quick-select" size="mini" @change="quickCode(code.en,$event)">
            <el-option v-for="(option,j) in code.props" :key="j" :label="option.cn" :value="option.en"/>
          </el-select>
          <el-tag v-else class="quick-tag" size="mini" @click="quickCode(code.en)">{{ code.cn }}</el-tag>
        </template>
      </div>
      <el-input id="nga-post-textarea"
                v-model="postParams.content"
                :rows="!postParams.content?5:Math.max(postParams.content.split(`\n`).length+1,5)" placeholder="正文"
                style="margin-bottom: 5px"
                type="textarea"
                @keyup.enter.ctrl="sendPost"
                @keyup.enter.alt="parseCode"
      />

    </el-main>
    <el-footer>
      <el-button type="success" @click="sendPost">发帖(Ctrl+Enter)</el-button>
    </el-footer>
  </el-container>

</template>

<script>
import {postRequest} from "@/assets/request/post-request";
import {bbsCodeLibrary, searchBbsCode} from "@/assets/nga/bbscode";
import {addTextInToTextarea} from "@/assets/utils/DomUtils";

export default {
  name: "nga-post-ui",
  data() {
    return {
      postParams: {
        subject: "",
        content: "",
        attachments: [],
        attachmentsCheck: [],
        comment: false,
      },
      bbsCodeLibrary,
      selection: {},
    }
  },
  methods: {
    quickCode(code, props) {
      const startText = props ? `[${code}=${props}]` : `[${code}]`;
      const endText = `[/${code}]`
      const dom = this.textarea();
      addTextInToTextarea(dom, {startText, endText,})
    },
    keypress(e) {
      console.log(e)
    },
    textarea() {
      return document.getElementById('nga-post-textarea')
    },
    parseCode() {
      const dom = this.textarea();
      let text = this.postParams.content.substring(0, dom.selectionStart)
      text = text.substring(text.lastIndexOf(" "))
      const bbsCode = searchBbsCode(text.trim());
      if (bbsCode) {
        //  找到代码
        const {code, props: prop} = bbsCode
        const startText = prop ? `[${code}=${prop}]` : `[${code}]`;
        const endText = `[/${code}]`
        addTextInToTextarea(dom, {
          startText, endText,
          startPosition: dom.selectionStart - text.length,
          userInnerText: false,
        })
      }
    },
    async sendPost() {
      const data = {
        ...this.preParam,
        step: 2,
      };
      const {subject, comment, content, attachments, attachmentsCheck} = this.postParams
      data.post_subject = subject;
      data.post_content = content;
      if (attachments && attachments.length > 0) {
        data.attachments = attachments.join('\t')
      }
      if (attachmentsCheck && attachmentsCheck.length > 0) {
        data.attachments_check = attachmentsCheck.join('\t')
      }
      if (comment) {
        data.comment = 1
      }
      const res = await postRequest(data)
      console.log(res)
    },
  },
  mounted() {
    this.postParams.content = this.content

    if (this.focus) {
      this.textarea().focus()
    }
  },
  watch: {},
  props: {
    preParam: {type: Object, required: true},
    content: {},
    auth: {},
    focus: {type: Boolean, default: false},
  },
}

</script>

<style scoped>
.quick-tag {
  cursor: pointer;
  margin-left: 2px;
}

.quick-select {
  width: 100px;
  margin-left: 2px
}
</style>