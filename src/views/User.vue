<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>

    <el-main>
      <user-center :uid="$route.params.uid" />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import UserCenter from "@/components/user-center";

export default {
  name: "User",
  components: {UserCenter},
  data() {
    return {
      data:{},
    }
  },
  methods: {
  },
   mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>