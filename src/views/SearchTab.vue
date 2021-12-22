<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>

    <el-main>
      {{$route}}
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "SearchTab",
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