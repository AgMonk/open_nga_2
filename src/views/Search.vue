<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      {{$route.params.key}}
    </el-header>

    <el-main>
      <router-view/>
    </el-main>
  </el-container>

</template>

<script>
export default {
  name: "Search",
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