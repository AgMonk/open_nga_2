<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->

    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="个人中心">
          <user-center :uid="$route.params.uid" />
        </el-tab-pane>

        <el-tab-pane label="Config">Config</el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import UserCenter from "@/components/nga/user/user-center";

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