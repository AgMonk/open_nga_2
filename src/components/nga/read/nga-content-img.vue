<template>
  <el-tooltip content="点击打开原图" effect="light">
    <el-image :src="link" @click="open"/>
  </el-tooltip>
</template>

<script>

export default {
  name: "nga-content-img",
  data() {
    return {
      link: "",
      openUrl: '',
    }
  },
  methods: {
    open() {
      window.open(this.openUrl)
    },
    update(src) {

      if (src.startsWith('https://img.nga.178.com/attachments/') || src.startsWith('./')) {
        this.link = '/attachments/' + src.substring(src.indexOf("mon_"))
        this.openUrl = '/attachments/' + src
            .replace(".medium.jpg", "")
            .replace(/\.thumb.*jpg/, "")
      } else {
        this.link = '/proxy' + src.replace('https://', '').replace('http://', '')
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