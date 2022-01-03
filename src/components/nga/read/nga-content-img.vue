<template>
  <el-tooltip content="点击打开原图" effect="light">
    <span><el-image v-if="show" :preview-src-list="srcList" :src="link" hide-on-click-modal/></span>
  </el-tooltip>
</template>

<script>

export default {
  name: "nga-content-img",
  data() {
    return {
      link: "",
      show: false,
      srcList: [],
    }
  },
  methods: {
    update(src) {
      this.show = false;
      if (src.startsWith('https://img.nga.178.com/attachments/') || src.startsWith('http://img.nga.178.com/attachments/') || src.startsWith('./')) {
        this.link = '/attachments/' + src.substring(src.indexOf("mon_"))
        this.srcList = ['/attachments/' + src.replace(".medium.jpg", "").replace(/\.thumb.*jpg/, "")]
        this.show = true;
      } else {
        this.link = '/proxy/' + src.replace('https://', '').replace('http://', '')
        this.show = true;
      }
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
  },
}

</script>

<style scoped>

</style>