<template>
  <span>
    <el-upload
        ref="upload"
        :action="attachUrl"
        :before-upload="beforeUpload"
        :data="params"
        :file-list.sync="fileList"
        :on-error="onError"
        :on-remove="onRemove"
        :on-success="success"
        accept="image/*, .zip, .mp3, .mp4"
        drag
        list-type="picture-card"
        multiple
        name="attachment_file0"
        with-credentials
    >
      <template #file="{file}">
        <div v-if="file">
          <!--图标里的内容-->
            <el-image v-if="isImage(file)"
                      :id="file.url" :preview-src-list="[getUrl(file.url)]" :src="getUrl(file.url)" hide-on-click-modal/>
          <span v-if="isZip(file)">[压缩包] {{ file.filename }}</span>
          <!--loading 图标-->
          <span v-if="!file.status || file.status!==`success`" class="el-upload-list__item-actions">
             <el-icon class="is-loading"><loading/></el-icon>
          </span>
          <!--完成后的操作图标-->
          <span v-if="file.status&& file.status===`success`">
          <span class="el-upload-list__item-actions">
            <el-icon v-if="isImage(file)" class="click-able" @click="clickZoomIn(file)"><zoom-in/></el-icon>
            <el-icon class="click-able" @click="clickPlus(file)"><plus/></el-icon>
            <el-icon class="click-able" @click="clickDelete(file)"><delete/></el-icon>
          </span>
          </span>
        </div>
      </template>
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        点击上传
      </div>
    </el-upload>
  </span>
</template>

<script>
import {Briefcase, Delete, Loading, Plus, UploadFilled, ZoomIn} from '@element-plus/icons';
import {encodeUTF8} from "@/assets/utils/StringUtils";
import {ElMessage, ElMessageBox} from "element-plus";
import {isImage, isMp3, isMp4, isZip} from "@/assets/utils/FileUtils";
import {delAttach} from "@/assets/request/nuke-request";

export default {
  name: "nga-upload",
  emits: ["delete", "add", "plus"],
  components: {UploadFilled, Loading, ZoomIn, Delete, Plus, Briefcase},
  data() {
    return {
      params: {
        func: "upload",
        v2: 1,
        origin_domain: "bbs.nga.cn",
        __output: 11,
        __inchst: "UTF8",
        auth: this.auth,
        fid: this.fid,
      },
      fileList: [],
    }
  },
  methods: {
    getUrl(url) {
      if (url.startsWith('mon_')) {
        return '/attachments/' + url
      }
      return url;
    },
    isImage, isZip, isMp3, isMp4,
    clickPlus(file) {
      console.log(file)
      if (file.url.startsWith('mon_')) {
        this.$emit('plus', file)
      } else {
        this.$emit('plus', file.response)
      }
    },
    clickDelete(file) {
      console.log(file)

      ElMessageBox.confirm(
          `确认删除附件？`,
          '确认删除',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: '确认删除',
          }
      )
          .then(() => {
            if (file.url.startsWith('mon_')) {
              const {tid, pid} = this.$route.query
              delAttach({tid, pid, aid: file.name}).then(res => {
                ElMessage.success(res.data["0"])
                this.$refs.upload.handleRemove(file)
                this.$emit('delete', file)
              })

            } else {
              this.$refs.upload.handleRemove(file)
              this.$emit('delete', file.response)
            }
          })
          .catch(reason => {
            ElMessage.info("已取消")
            console.log(reason)
          })

    },
    clickZoomIn(file) {
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
      document.getElementById(file.url).click()
    },
    beforeUpload(file) {
      console.log(file)
      // 把非数字、 字母的字符使用 UTF-8编码
      let regExp = /[\W_]/
      let name = file.name;
      for (let i = name.length - 1; i >= 0; i--) {
        let char = name[i];
        if (regExp.exec(char)) {
          name = name.substring(0, i)
              + "%" + Number(encodeUTF8(char)).toString(16)
              + name.substring(i + 1);
        }
      }

      let m = 1024 * 1024;
      // console.log(file)
      // 尝试发现pixiv 或 推特图片
      /*填写描述 todo 解析图片来源*/

      const filename = 'attachment_file0'

      this.params[`${filename}_dscp`] = file.name;
      this.params[`${filename}_watermark`] = ``;
      this.params[`${filename}_img`] = 1;
      this.params[`${filename}_auto_size`] = file.size >= 4 * m ? 1 : 0;
      this.params[`${filename}_url_utf8_name`] = name;
    },

    success(response, file, fileList) {
      const {error_code, error} = response
      console.log(file)
      if (error) {
        if (error === 'file too big') {
          ElMessage.error(`文件过大: ${Math.floor(file.size / 1024)}K`)
        } else if (error === 'authorization timeout') {
          ElMessage.error('上传令牌过期请刷新页面重新获取')
        } else {
          ElMessage.error(error)
        }
        this.$refs.upload.handleRemove(file)
        return
      }

      //上传成功后添加属性
      if (isImage(file)) {
        file.type = '图片'
        file.ext = file.raw.type.split('/')[1]
      } else if (isZip(file)) {
        file.type = '压缩包'
        file.ext = 'zip'
      } else if (isMp3(file)) {
        file.type = 'mp3'
        file.ext = 'mp3'
      } else if (isMp4(file)) {
        file.type = 'mp4'
        file.ext = 'mp4'
      }

      response.filename = file.name

      this.$emit("add", response)
    },
    onError(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    onRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
    },
    update(e) {
      if (!e) {
        return
      }
      console.log(e)
      this.fileList = this.fileList.filter(i => i.url.startsWith('blob'))
      this.fileList = [...e, ...this.fileList]
      console.log(this.fileList)
    },
  },
  mounted() {
    this.update(this.existsFiles)
  },
  watch: {
    existsFiles(to) {
      this.update(to)
    }
  },
  props: {
    auth: {  // 必须提供字段
      type: String,
      required: true
    },
    attachUrl: {  // 必须提供字段
      type: String,
      default: '/upload',
    },
    fid: {
      required: true,
      type: Number,
    },
    existsFiles: {},
  },
}

</script>

<style scoped>
.click-able {
  cursor: pointer;
  margin: 0 5px;
}

.el-upload-dragger {
  width: 200px;
  height: 100%;
}
</style>