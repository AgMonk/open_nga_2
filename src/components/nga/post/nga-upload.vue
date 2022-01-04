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
        accept="image/*, .zip"
        drag
        list-type="picture-card"
        multiple
        name="attachment_file0"
        with-credentials
    >
      <template #file="{file}">
        <div>
          <img :src="file.url" alt="" class="el-upload-list__item-thumbnail"/>
          <span v-if="!file.status || file.status!==`success`" class="el-upload-list__item-actions">
                     <el-icon class="is-loading"><loading/></el-icon>
                    </span>
          <span v-if="file.status&& file.status===`success`" class="el-upload-list__item-actions">
                      <el-icon class="click-able" @click="handlePictureCardPreview(file)"><zoom-in/></el-icon>


            <!--          <span-->
            <!--              class="el-upload-list__item-preview"-->
            <!--              @click="addFile(file)"-->
            <!--          >-->
            <!--            <i class="el-icon-plus"></i>-->
            <!--          </span>-->
            <!--          <span-->
            <!--              class="el-upload-list__item-delete"-->
            <!--              @click="remove(file)"-->
            <!--          >-->
            <!--            <i class="el-icon-delete"></i>-->
            <!--          </span>-->
                  </span>
        </div>
      </template>
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>
    <el-dialog v-model="dialogVisible">
<!--      <img width="100%" :src="dialogImageUrl" alt=""/>-->
      <el-image :src="dialogImageUrl"/>
    </el-dialog>
  </span>
</template>

<script>
import {Loading, UploadFilled, ZoomIn} from '@element-plus/icons';
import {encodeUTF8} from "@/assets/utils/StringUtils";
import {ElMessage} from "element-plus";

export default {
  name: "nga-upload",
  components: {UploadFilled, Loading, ZoomIn},
  data() {
    return {
      //显示弹出框
      dialogVisible: false,
      dialogImageUrl: '',

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
  emits: ["file-list-changed"],
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {

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
      console.log(file)
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
      const {attachments, attachments_check, isImg, url} = response
      console.log(fileList)
      if (error) {
        if (error === 'file too big') {
          ElMessage.error(`文件过大: ${Math.floor(file.size / 1024)}K`)
        } else {
          ElMessage.error(error)
        }
        return
      }
      this.$emit("file-list-changed", fileList)
      console.log(fileList)
    },
    onError(response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    },
    onRemove(file, fileList) {
      this.$emit("file-list-changed", fileList)
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
}

.el-upload-dragger {
  width: 200px;
  height: 100%;
}
</style>