<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>

    </el-header>

    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "Post",
  data() {
    return {
      params: {},
    }
  },
  methods: {},
  mounted() {
    this.params = Object.assign({}, this.$route.query, this.$route.params)
    console.log(this.params)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>