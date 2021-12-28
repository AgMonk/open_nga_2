<template>
  <el-image
      class="nga-avatar"
      hide-on-click-modal
      :src="getUrl(list[i])"
      :preview-src-list="list.map(item=>getUrl(item))"
      :initial-index="i"
  />
</template>
<script>
const proxy = 'https://images.weserv.nl/?url='
const defaultProxy = 'https://images.weserv.nl/?url='

export default {
  name: "my-avatar",
  data() {
    return {
      random: 0,
      i: 0,
    }
  },
  methods: {
    errorHandler(e) {
      console.error(e)
    },
    getUrl(url) {
      return proxy + url.replace("https://", "").replace("http://", "")
    }
  },
  mounted() {
    this.random = Math.floor(Math.random() * this.list.length);
    this.i = this.index ? this.index : this.random;
  },
  watch: {},
  props: {
    list: {
      type: Object,
    },
    index: {
      type: Number,
      default: 0,
    }
  },
}

</script>

<style scoped>
.nga-avatar {
  /*width: 100px;*/
  /*height: 100px;*/
  --el-avatar-bg-color: none;
}
</style>