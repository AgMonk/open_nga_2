<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <nga-breadcrumb />
    </el-header>

    <el-main style="--el-main-padding:0"><router-view/></el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import NgaBreadcrumb from "@/components/nga/nga-breadcrumb";
export default {
  name: "Thread",
  components: {NgaBreadcrumb},
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