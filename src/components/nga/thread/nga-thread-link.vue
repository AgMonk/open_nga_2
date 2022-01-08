<template>
  <el-tooltip effect="light">
    <template #content>
      <el-link v-if="isType(data.mirror, '版面')" :href="`https://bbs.nga.cn/thread.php?fid=${data.mirror.fid}`" target="_blank">打开官方</el-link>
      <el-link v-else-if="isType(data.mirror, '合集')" :href="`https://bbs.nga.cn/thread.php?stid=${data.tid}`" target="_blank">打开官方</el-link>
      <el-link v-else :href="`https://bbs.nga.cn/read.php?tid=${data.tid}`" target="_blank">打开官方</el-link>
    </template>
    <my-router-link :style="data.titleFont?data.titleFont.style:undefined" :to="getRoute(data)">
      <span v-if="!$slots.defalut">{{ text ? text : data.subject }}</span>
      <slot />
    </my-router-link>
  </el-tooltip>
</template>

<script>
import MyRouterLink from "@/components/my/my-router-link";

export default {
  name: "nga-thread-link",
  components: {MyRouterLink},
  data() {
    return {}
  },
  methods: {
    //判断是否为子主题
    isType(mirror, type) {
      return mirror && mirror.type && (mirror.type === type || type.includes(mirror.type));
    },
    getRoute(data) {
      if (this.isType(data.mirror, '版面')) {
        return {name: '浏览版面主题', params: {fid: data.mirror.fid, page: 1}}
      } else if (this.isType(data.mirror, '合集')) {
        return {name: '浏览合集主题', params: {stid: data.tid, page: 1}}
      }
      return {name: '回复列表', params: {tid: data.tid, page: 1}}
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    data: {type: Object, required: true},
    text: {},
  },
}

</script>

<style scoped>

</style>