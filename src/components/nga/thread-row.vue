<template>
  <el-row >
    <el-col :span="isType(data.mirror,[ '合集主题', '子版主题'])?20:24">
      <nga-thread-link :data="data" />
    </el-col>
    <el-col v-if="isType(data.mirror,[ '合集主题', '子版主题'])" :span="4" style="text-align: right">
      <my-router-link v-if="isType(data.mirror,'合集主题')" :to="`/thread/s/${data.mirror.stid}/1`">
        [{{data.mirror.collection}}]
      </my-router-link>
    <my-router-link v-if="isType(data.mirror,'子版主题')" :to="`/thread/f/${data.mirror.fid}/1`">
        [{{data.mirror.forum}}]
      </my-router-link>
    </el-col>
  </el-row>
</template>

<script>
import MyRouterLink from "@/components/my/my-router-link";
import NgaThreadLink from "@/components/nga/nga-thread-link";

export default {
  name: "thread-row",
  components: {NgaThreadLink, MyRouterLink},
  data() {
    return {}
  },
  methods: {
    //判断是否为子主题
    isType(mirror,type) {
      return mirror && mirror.type && (mirror.type===type || type.includes(mirror.type));
    },
    // getRoutePath(type,id){
    //   switch (type) {
    //     case "合集":return `/thread/s/${id}/1`;
    //     case "版面":return `/thread/f/${id}/1`;
    //     case "合集主题":return `/thread/s/${id}/1`;
    //     case "子版主题":return `/thread/f/${id}/1`;
    //     default:return `/read/t/${id}/1`;
    //   }
    // }
  },
  mounted() {
  },
  watch: {},
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
}

</script>

<style scoped>

</style>