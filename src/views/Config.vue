<!--配置-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->

    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="个人中心">
          <user-center/>
        </el-tab-pane>
        <el-tab-pane label="账号管理">
          <my-accounts/>
        </el-tab-pane>
        <el-tab-pane label="配置">Config</el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import MyAccounts from "@/components/nga/user/my-accounts";
import {setTitle} from "@/assets/request/ProjectUtils";
import UserCenter from "@/components/nga/user/user-center";

export default {
  name: "Config",
  components: {UserCenter, MyAccounts},
  data() {
    return {}
  },
  methods: {},
  mounted() {
    setTitle("配置")
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>