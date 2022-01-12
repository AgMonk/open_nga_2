<template>
  <el-tooltip :content="data.dsc" :disabled="!data.dsc" effect="light">
    <span>
      <el-tag :type="tagType">
        {{ data.type }}
      </el-tag>
      <el-link :download="filename" :href="'/attachments/'+data.url">
        {{ filename }}
      </el-link>
      ({{ data.size }}K)
    </span>
  </el-tooltip>
</template>

<script>
export default {
  name: "nga-attach-tag",
  data() {
    return {
      tagType: '',
      filename: '',
    }
  },
  methods: {
    update(data) {
      const {type} = data
      switch (type) {
        case "图片":
          this.tagType = 'success';
          break;
        case "压缩包":
          this.tagType = 'danger';
          break;
        case "mp3":
        case "mp4":
          this.tagType = 'warning';
          break;
        default:
          this.tagType = '';
      }
      this.filename = data.filename ? data.filename : data.url.substring(data.url.lastIndexOf('/') + 1)
    },
    getType(type) {
      switch (type) {
        case "图片":
          return 'success';
        case "压缩包":
          return 'danger';
        case "mp3":
        case "mp4":
          return 'warning';
        default:
          return ""
      }
    },
  },
  mounted() {
    this.update(this.data)
  },
  watch: {
    data(to) {
      this.update(to)
    }
  },
  props: {
    data: {}
  },
}

</script>

<style scoped>

</style>