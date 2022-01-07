<template>
  <el-image
      v-if="list && list.length>0"
      :infinite="false"
      :initial-index="i"
      :preview-src-list="list"
      :src="list[i]"
      class="nga-avatar"
      hide-on-click-modal
      style="max-width: 200px"
      @error="errorHandler"
  />
</template>
<script>

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
      console.error(`头像加载失败`, e)
      // if (this.list.length>0){
      //   this.i++
      // }
      // if (this.i === this.list.length){
      //   this.i = 0;
      // }
    },
  },
  mounted() {
    this.random = Math.floor(Math.random() * this.list.length);
    this.i = this.index ? this.index : this.random
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