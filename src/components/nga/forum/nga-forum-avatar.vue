<template>
<div style="width: 80px;text-align: center;display:inline-block;vertical-align: top;cursor: pointer" >
<my-router-link :to="route">
  <el-avatar shape="square" :size="50"
             :src="src"
             @error="errorHandler"
             style="--el-avatar-bg-color:none;margin-top: 0"
  />
  <div>
    {{name}}
  </div>
</my-router-link>
</div>
</template>

<script>

import MyRouterLink from "@/components/my/my-router-link";

// icon0: `https://img4.nga.178.com/proxy/cache_attach/ficon/${f.fid}u.png`,
//     icon1: `http://img4.ngacn.cc/ngabbs/nga_classic/f/${f.fid}.png`


export default {
  name: "forum-avatar",
  components: {MyRouterLink},
  data() {
    return {
      src: ``,
      route: {},
      defaultSrc: require('@/assets/icon/00.png'),
      name: "",
    }
  },
  methods: {
    errorHandler(e){
      this.src = this.defaultSrc
    },
    update(f){
      const {fid,stid,name} = f;
      this.name = name.substring(0,Math.min(name.length,10));
      if (fid) {
        this.src = `/icon/f/${fid}u.png`;
        this.route = {name: "浏览版面主题", params: {page: 1, fid}}
      } else {
        this.src = this.defaultSrc;
        this.route = {name: "浏览合集主题", params: {page: 1, stid}}
      }
    },
  },
  mounted() {
    this.update(this.forum)
  },
  watch: {
    forum(to){
      this.update(to)
    },
  },
  props: {
    forum:{
      type:Object,
      required: true,
    }
  },
}

</script>

<style scoped>
.router-link-active {
  text-decoration: none;

}

a {
  text-decoration: none;
}
</style>