<template>
  <span>
    <el-tooltip :show-after="500" effect="light">
      <template #content>
        <h3>点击打开原图</h3>
        <div v-if="src && isNgaImg(src)">
          <el-divider content-position="left">复制</el-divider>
          <my-copy-button :copy-text="`[img]./${src.substring(src.indexOf('mon_'))}[/img]`" text="BbsCode" />
          <my-copy-button :copy-text="`https://img.nga.178.com${link}`" text="地址" />
        </div>
        <div v-if="link">
          <el-divider content-position="left">打开</el-divider>
          <el-button size="small" type="primary" @click="open(link)">打开原图</el-button>
          <el-button size="small" type="primary" @click="download(link)">下载原图</el-button>
        </div>
      </template>
      <span>
        <el-image v-if="show" :id="uuid" :preview-src-list="srcList" :src="link" append-to-body hide-on-click-modal />
      </span>
    </el-tooltip>
    <br v-if="br" />
  </span>
</template>

<script>

import MyCopyButton from "@/components/my/my-copy-button";

export default {
  name: "nga-content-img",
  components: {MyCopyButton},
  data() {
    return {
      link: "",
      show: false,
      srcList: [],
      uuid: "",
      br: false,
    }
  },
  methods: {
    download(url) {
      const a = document.createElement("a")
      a.href = url;
      a.download = url.substring(url.lastIndexOf('/') + 1)
      a.click()
    },
    open(url) {
      window.open(url)
    },
    isNgaImg(src) {
      //判断是否为nga上的图片
      return src.includes('nga.178.com') || src.startsWith('./')
    },
    update(src) {
      this.show = false;
      if (this.isNgaImg(src)) {
        this.link = '/attachments/' + src.substring(src.indexOf("mon_"))
        this.srcList = ['/attachments/' + src.replace(".medium.jpg", "").replace(/\.thumb.*jpg/, "")]
      } else {
        this.link = '/proxy/' + encodeURI(src.replace('https://', '').replace('http://', ''))
      }
      this.uuid = 'img' + Math.floor(233280 * Math.random())
      this.show = true;

      setTimeout(() => {
        const img = document.getElementById(this.uuid);
        if (img && img.width > 400) {
          this.br = true;
        }
      }, 1000)
    },
  },
  mounted() {
    this.update(this.src)
  },
  watch: {
    src(to) {
      this.update(to)
    }
  },
  props: {
    src: {type: String, required: true},
    filename: {type: String},
  },
}

</script>

<style scoped>

</style>