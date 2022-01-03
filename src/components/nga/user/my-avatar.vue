<template>
  <el-image
      v-if="list && list.length>0"
      class="nga-avatar"
      hide-on-click-modal
      :infinite="false"
      :preview-src-list="list"
      :src="list[i]"
      :initial-index="i"
      style="max-width: 200px"
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
      console.error(e)
    },
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