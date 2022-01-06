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

export default {
  name: "my-navigation",
  components: {MyNavigationItem},
  data() {
    return {
      routes: [
        {path: '/home', name: '社区'},
        {
          path: '/my', name: '我的',
          children: [
            {path: "messages", name: "短消息"},
            {path: "config", name: "配置"},
            {path: "favor/1", name: "收藏"},
            {path: "tips", name: "关于"},
          ]
        },
      ],
      activeIndex: "",
      url: "",
    }
  },
  computed: {},
  methods: {
    handleClick(e) {
      console.log(e)
    },

    select(index, indexPath) {
      // console.log(this.activeIndex)
    }
  },
  mounted() {
    this.activeIndex = this.$route.path
  },
  watch: {
    $route(to, from) {
      this.activeIndex = to.path
    }
  }
}

</script>

<style scoped>

</style>