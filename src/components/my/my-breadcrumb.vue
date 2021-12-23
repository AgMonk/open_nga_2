<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in breadcrumbs" :to="getRoute(item)">
      <el-dropdown split-button type="primary" size="small" @command="command">
        {{ item.name }}
        <template #dropdown v-if="['版面','合集','主题'].includes(item.type)">
          <el-dropdown-menu >
            <el-dropdown-item v-if="item.type==='版面'" v-for="i in forums" :command="i">{{ i.name }}</el-dropdown-item>
            <el-dropdown-item v-if="item.type==='合集'" v-for="i in sets" :command="i">{{ i.name }}</el-dropdown-item>
            <el-dropdown-item v-if="item.type==='主题'" v-for="i in threads" :command="i">{{ i.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "my-breadcrumb",
  data() {
    return {}
  },
  computed: {
    ...mapState('breadcrumb', [`breadcrumbs`]),
    ...mapState('history',[`forums`,`threads`,`sets`])
  },
  methods: {
    command(c){
      const {fid,tid,stid,recommend} = c;
      if (fid){
        this.$router.push({name:'浏览版面主题',query:{recommend},params:{fid,page:1}})
      } else if (stid){
        this.$router.push({name:'浏览合集主题',params:{stid,page:1}})
      } else if (tid){
        this.$router.push({name:'回复列表',params:{tid,page:1}})
      }
    },
    getRoute(item) {
      const {fid, stid, tid} = item
      switch (item.type) {
        case'版面':
          return `/thread/f/${fid}/1`;
        case'合集':
          return `/thread/s/${stid}/1`;
        case'主题':
          return `/read/t/${tid}/1`;
        case'精华区':
          return `/thread/f/${fid}/1?recommend=1`;
        default:
          break;
      }
    }
  },
  mounted() {

  },
  watch: {
  },
  props: {},
}

</script>

<style scoped>

</style>