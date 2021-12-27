<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>

    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "nga-read-table",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    threads: {
      type: Object,
      required: true,
    },
    pageData: {
      type: Object,
      required: true,
    },
  },
}

</script>

<style scoped>

</style>