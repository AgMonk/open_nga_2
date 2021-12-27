<template>
  <span>
    {{content}}
<!--    todo 解析 渲染-->
  </span>

</template>

<script>
export default {
  name: "nga-content",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    content: {type:String,required: true}
  },
}

</script>

<style scoped>

</style>