<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapState} from "vuex";

export default {
  name: "MyPost",
  data() {
    return {}
  },
  computed: {
    ...mapState('users', [`currentUser`])
  },
  methods: {},
  mounted() {
    const {uid} = this.currentUser
    const {query} = this.$route
    this.$router.push({name: '搜索用户发言', params: {authorid: uid, page: 1}, query})
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>