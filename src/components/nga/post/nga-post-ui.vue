<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main v-loading="loading">
      <div id="快捷按钮" style="margin-bottom: 10px">
        <template v-for="(code,i) in bbsCodeLibrary" :key="i">
          <el-select v-if="code.props" :placeholder="code.cn" class="quick-select" size="mini" @change="quickCode(code.en,$event)">
            <el-option v-for="(option,j) in code.props" :key="j" :label="option.cn" :value="option.en"/>
          </el-select>
          <el-tag v-else class="quick-tag" size="mini" @click="quickCode(code.en)">{{ code.cn }}</el-tag>
        </template>
        <el-button size="mini" type="primary" @click="showAllEmotes">表情</el-button>
        <div>
          <el-switch v-model="postParams.comment" :before-change="confirmComment" active-text="评论"/>
          <el-switch v-model="postParams.anony" :before-change="confirmAnonymous" active-text="匿名"/>
        </div>
      </div>
      <div>
        <el-input v-model="postParams.subject" placeholder="标题"/>
      </div>
      <el-input id="nga-post-textarea"
                v-model="postParams.content"
                :rows="!postParams.content?5:Math.max(postParams.content.split(`\n`).length+1,5)" placeholder="正文"
                style="margin-bottom: 5px"
                type="textarea"
                @keyup.enter.ctrl="sendPost"
                @keyup.enter.alt="parseCode"
      />

      <div>
        <nga-upload v-if="auth"
                    :auth="auth"
                    :exists-files="attachs"
                    :fid="fid"
                    @add="addFile"
                    @delete="deleteFile"
                    @plus="plusFile"
        />
      </div>
    </el-main>


    <el-dialog v-model="dialogShow.emote" title="表情" width="80%">
      <el-tabs v-model="currentEmoteTab" type="border-card">
        <el-tab-pane v-for="item in emoteOptions" :label="item.name" :name="item.name" style="text-align: left">
          <span v-for="e in item.data" v-if="currentEmoteTab===item.name" style="cursor: pointer;" @click="clickEmote(e.code,item.name)">
            <nga-emote-image :data="e"/>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-footer>
      <el-button type="success" @click="sendPost">发帖(Ctrl+Enter)</el-button>
    </el-footer>
  </el-container>

</template>

<script>
import {postRequest} from "@/assets/request/post-request";
import {bbsCodeLibrary, searchBbsCode} from "@/assets/nga/bbscode";
import {addTextInToTextarea} from "@/assets/utils/DomUtils";
import {emotes, mapEmoteToArray, searchEmotes} from "@/assets/nga/emotions";
import "@/assets/nga/emotions_cus"
import NgaEmoteImage from "@/components/nga/post/nga-emote-image";
import {ElMessage, ElMessageBox} from "element-plus";
import NgaUpload from "@/components/nga/post/nga-upload";

const anonymousWarning = '匿名发布主题、回复分别需要5k、100铜币\n\n匿名发布的内容如果违反班规将会：加 重 处 罚'

export default {
  name: "nga-post-ui",
  components: {NgaUpload, NgaEmoteImage},
  data() {
    return {
      loading: false,
      emotes,
      postParams: {
        subject: "",
        content: "",
        attachments: [],
        attachmentsCheck: [],
        comment: false,
        anony: false,
      },
      bbsCodeLibrary,
      selection: {},
      emoteOptions: [],
      dialogShow: {
        emote: false,
      },
      currentEmoteTab: '',
    }
  },
  methods: {
    confirmAnonymous() {
      if (this.postParams.anony) {
        return true;
      }
      return ElMessageBox.confirm(anonymousWarning, {
        title: '确认使用匿名',
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).catch(reason => {
        ElMessage.info("已取消")
        console.log(reason)
      })
    },
    confirmComment() {
      if (this.postParams.comment) {
        return true;
      }
      return ElMessageBox.confirm('评论需要100铜币', {
        title: '确认使用评论',
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).catch(reason => {
        ElMessage.info("已取消")
        console.log(reason)
      })
    },
    //上传成功 记录验证码
    plusFile(file) {
      console.log(file)
      const {filename, url} = file
      let startText;
      if (url.endsWith(".zip")) {
        startText = `[url=https://img.nga.178.com/attachments/${url}]下载文件 ${filename}[/url]`
      } else if (url.endsWith('.mp3')) {
        startText = `[attach]./${url}[/attach]`
      } else if (url.endsWith('.mp4')) {
        startText = `[flash]./${url}[/flash]`
      } else {
        startText = `[img]./${url}[/img]`
      }
      this.addText(this.textarea(), {startText})
    },
    addFile(file) {
      const {attachments, attachments_check, isImg, url} = file
      this.postParams.attachments.push(attachments)
      this.postParams.attachmentsCheck.push(attachments_check)
    },
    //删除文件成功 移除验证码
    deleteFile(file) {
      console.log(file)
      const {attachments, attachments_check, url} = file

      //未保存文件
      if (attachments && attachments_check) {
        this.postParams.attachments = this.postParams.attachments.filter(i => i !== attachments)
        this.postParams.attachmentsCheck = this.postParams.attachmentsCheck.filter(i => i !== attachments_check)
      }
      //  已保存文件
      //删除正文中的代码
      const p = new RegExp(`\\[img]\.\/${url.substring(0,url.length-5)}.+?\\[\/img]`, "g")
      this.postParams.content = this.postParams.content.replace(p, "")
    },
    addText(dom, {
      startText,
      endText = "",
      startPosition = dom.selectionStart,
      endPosition = dom.selectionEnd,
      useInnerText = true,
    }) {
      addTextInToTextarea(dom, {
        startText,
        endText,
        startPosition,
        endPosition,
        useInnerText,
      })
      this.postParams.content = dom.value;
    },
    showAllEmotes() {
      this.emoteOptions = emotes.map(i => {
        const {name} = i;
        const data = mapEmoteToArray(i)
        return {name, data}
      })
      this.dialogShow.emote = true
      this.currentEmoteTab = this.emoteOptions[0].name
    },
    clickEmote(code, name) {
      console.log(1)
      this.dialogShow.emote = false
      const dom = this.textarea();
      if (name === '搜索结果') {
        let text = this.postParams.content.substring(0, dom.selectionStart)
        text = text.substring(text.lastIndexOf(" "))
        this.addText(dom, {
          startText: code,
          startPosition: dom.selectionStart - text.length,
          useInnerText: false,
        })
        console.log("替换")
      } else {
        console.log("插入")
        this.addText(dom, {startText: code,})
      }
    },
    quickCode(code, props) {
      const startText = props ? `[${code}=${props}]` : `[${code}]`;
      const endText = `[/${code}]`
      const dom = this.textarea();
      this.addText(dom, {startText, endText,})
    },
    keypress(e) {
      console.log(e)
      return false
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
        this.addText(dom, {
          startText, endText,
          startPosition: dom.selectionStart - text.length,
          useInnerText: false,
        })
      } else {
        //  搜索表情
        const data = searchEmotes(text.trim())
        console.log(data)
        if (data.length === 1) {
          //  找到一个表情 添加
          const startText = data[0].code
          this.addText(dom, {
            startText,
            startPosition: dom.selectionStart - text.length,
            useInnerText: false,
          })
        }
        if (data.length > 1) {
          this.emoteOptions = [{name: '搜索结果', data}]
          this.currentEmoteTab = this.emoteOptions[0].name
          this.dialogShow.emote = true
        }

      }
    },
    async sendPost() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const data = {
        ...this.preParam,
        step: 2,
      };
      const {subject, comment, content, attachments, attachmentsCheck, anony} = this.postParams
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
      if (anony) {
        data.anony = 1
      }
      const res = await postRequest(data)
      console.log(res)
      const {tid, page, text, pid} = res;
      ElMessage.success(text)
      // if (page) {
      await this.$router.push({name: '回复列表', params: {tid, page: 'e'}, hash: pid ? `#P${pid}` : undefined})
      // }else{
      //   await this.$router.push({name: '单个回复', params: {pid}, hash:pid ? `#P${pid}` : undefined})
      // }
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
    fid: {type: Number, required: true},
    attachs: {}
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