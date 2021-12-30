<template>
  <el-tooltip :content="data.uuid" effect="light">
    <el-image :src="data.url" style="max-width: 100px"/>
  </el-tooltip>
</template>

<script>
export default {
  name: "nga-emote-image",
  data() {
    return {}
  },
  emits: ['click'],
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    data: {type: Object, required: true}
  },
}

</script>

<style scoped>

</style>