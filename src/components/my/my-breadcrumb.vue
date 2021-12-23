<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in breadcrumbs" :to="getRoute(item)">{{item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "my-breadcrumb",
  data() {
    return {}
  },
  computed:{
    ...mapState('breadcrumb',[`breadcrumbs`])
  },
  methods: {
    getRoute(item){
      const {fid,stid,tid} = item
      switch (item.type) {
        case'版面':return {path:`/thread/f/${fid}/1`};
        // case'版面':return `/thread/f/${fid}/1`;
        case'合集':return `/thread/s/${stid}/1`;
        case'主题':return `/read/t/${tid}/1`;
        case'精华区':return `/thread/f/${fid}/1?recommend=1`;
        default:break;
      }
    }
  },
  mounted() {
    console.log(this.$route)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>