
<template>
  <el-menu
      :default-active.sync="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      @select="select"
      router
      active-text-color="#ffd04b">
  <my-navigation-item v-for="(route,i) in routes" :key="i" :route="route" parent-path=""/>
  </el-menu>
</template>

<script>
import MyNavigationItem from "@/components/my/my-navigation-item";
import {mapState} from "vuex";

export default {
  name: "my-navigation",
  components: {MyNavigationItem},
  data() {
    return {
      routes:[
        {path:'/forum',name:'社区'},
        {path:'/my',name:'我的'},
      ],
      activeIndex:location.pathname,
      url:"",
    }
  },
  computed: {
  },
  methods: {
    handleClick(e){
      console.log(e)
    },

    select(index,indexPath){
    }
  },
  mounted() {
  },
}

</script>

<style scoped>

</style>