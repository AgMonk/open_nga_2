<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <div>{{ $route.name }}</div>
    </el-header>

    <el-main>
      <div>{{ $route.params }}</div>
      <div>{{ $route.query }}</div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "ReadTab",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>