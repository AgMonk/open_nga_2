<!--用户中心-->
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
  name: "user-center",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    uid:{required:true}
  },
}

</script>

<style scoped>

</style>