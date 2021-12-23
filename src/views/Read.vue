<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>

    <el-main>      <router-view/>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "Read",
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