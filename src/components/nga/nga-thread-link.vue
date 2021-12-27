<template>
  <my-router-link v-if="isType(data.mirror,'版面')" :to="`/thread/f/${data.mirror.fid}/1`" :style="data.titleFont?data.titleFont.style:undefined">
    {{data.subject}}
  </my-router-link>
  <my-router-link v-else-if="isType(data.mirror,'合集')" :to="`/thread/s/${data.tid}/1`" :style="data.titleFont?data.titleFont.style:undefined">
    {{data.subject}}
  </my-router-link>
  <my-router-link v-else :to="`/read/t/${data.tid}/1`" :style="data.titleFont?data.titleFont.style:undefined">
    {{data.subject}}
  </my-router-link>
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
    isType(mirror,type) {
      return mirror && mirror.type && (mirror.type===type || type.includes(mirror.type));
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    data:{type:Object,required:true}
  },
}

</script>

<style scoped>

</style>