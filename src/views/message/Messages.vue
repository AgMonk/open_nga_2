<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header><h3>短消息</h3></el-header>
    <el-main>
      <router-view />
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import NgaUserLink from "@/components/nga/user/nga-user-link";
import MyTimestamp from "@/components/my/my-timestamp";

export default {
  name: "Messages",
  components: {MyTimestamp, NgaUserLink},
  data() {
    return {
    }
  },
  methods: {
  },
  async mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>