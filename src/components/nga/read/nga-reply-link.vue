<template>
  <my-router-link :to="getRoute(pid,tid,page)">
    <slot/>
  </my-router-link>
</template>

<script>
import MyRouterLink from "@/components/my/my-router-link";

export default {
  name: "nga-reply-link",
  components: {MyRouterLink},
  data() {
    return {}
  },
  methods: {
    getRoute(pid, tid, page) {
      if (tid && page) {
        return {
          name: "回复列表",
          params: {tid, page},
          hash: `#P${pid}`,
        }
      }
      return {
        name: "单个回复",
        params: {pid}
      }
    }
  },
  mounted() {
  },
  watch: {},
  props: {
    pid: {required: true},
    tid: {},
    page: {},
  },
}

</script>

<style scoped>

</style>