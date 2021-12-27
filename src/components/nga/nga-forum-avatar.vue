<template>
<div style="width: 80px;text-align: center;display:inline-block;vertical-align: top;cursor: pointer" @click="click">
  <el-avatar shape="square" :size="50"
             :src="src"
             @error="errorHandler"
             style="--el-avatar-bg-color:none;margin-top: 0"
  />
  <div>
    {{name}}
  </div>
</div>
</template>

<script>

const proxy ='https://images.weserv.nl/?url='
const defaultProxy = 'https://images.weserv.nl/?url='

// icon0: `https://img4.nga.178.com/proxy/cache_attach/ficon/${f.fid}u.png`,
//     icon1: `http://img4.ngacn.cc/ngabbs/nga_classic/f/${f.fid}.png`


export default {
  name: "forum-avatar",
  data() {
    return {
      src:``,
      route:{},
      defaultSrc :`${defaultProxy}img4.nga.178.com/ngabbs/nga_classic/f/00.png`,
      name:"",
    }
  },
  methods: {
    errorHandler(e){
      this.src = this.defaultSrc
    },
    update(f){
      const {fid,stid,name} = f;
      this.name = name.substring(0,Math.min(name.length,10));
      if (stid){
        this.src = this.defaultSrc;
        this.route = {name:"浏览合集主题",params:{page:1,stid}}
      }else{
        this.src = `${proxy}img4.nga.178.com/proxy/cache_attach/ficon/${fid}u.png`;
        this.route = {name:"浏览版面主题",params:{page:1,fid}}
      }
    },
    click(){
      this.$router.push(this.route)
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

</style>