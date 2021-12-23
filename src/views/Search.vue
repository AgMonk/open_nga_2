<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <my-breadcrumb />
      {{$route.params.key}}
    </el-header>

    <el-main>
      <router-view/>
    </el-main>
  </el-container>

</template>

<script>
import MyBreadcrumb from "@/components/my/my-breadcrumb";
export default {
  name: "Search",
  components: {MyBreadcrumb},
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