<template>
  <div>
    <h3>配置</h3>
    <div>
      <el-divider content-position="left">界面配色</el-divider>
      <style-config />

    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import StyleConfig from "@/components/nga/config/style-config";

export default {
  name: "my-config",
  components: {StyleConfig},
  computed: {
    ...mapState('config', ["config"]),
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