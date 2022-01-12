<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-header v-if="clientWidth>900">
      <nga-breadcrumb />
    </el-header>

    <el-main style="--el-main-padding:0">
      <router-view />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import NgaBreadcrumb from "@/components/nga/nga-breadcrumb";
import {mapState} from "vuex";

export default {
  name: "Read",
  components: {NgaBreadcrumb},
  computed: {
    ...mapState('client', [`clientWidth`]),
  },
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