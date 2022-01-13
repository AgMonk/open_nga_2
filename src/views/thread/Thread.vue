<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header v-if="clientMode==='PC端'">
      <nga-breadcrumb />
    </el-header>

    <el-main>
      <router-view />
    </el-main>
  </el-container>

</template>

<script>
import NgaBreadcrumb from "@/components/nga/nga-breadcrumb";
import {mapState} from "vuex";

export default {
  name: "Thread",
  components: {NgaBreadcrumb},
  computed: {
    ...mapState('client', [`clientMode`]),
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
.el-main {
  --el-main-padding: 0;
  overflow-y: hidden;
}
</style>