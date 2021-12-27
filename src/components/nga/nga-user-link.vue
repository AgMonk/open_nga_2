<template>
  <span v-if="(''+uid).startsWith('#anony_')">匿名用户{{(''+uid).substring(7,12)}}</span>
  <my-router-link v-else :to="{name: '用户中心',params:{uid}}">
    <span v-if="text">{{text}}</span>
    <span v-else-if="users[uid]">{{users[uid].username}}</span>
    <span v-else>UID:{{uid}}</span>
  </my-router-link>
</template>

<script>
import MyRouterLink from "@/components/my/my-router-link";
import {mapState} from "vuex";
export default {
  name: "nga-user-link",
  components: {MyRouterLink},
  data() {
    return {}
  },
  computed: {
    ...mapState("users",[`users`]),
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    uid:{},text:{}
  },
}

</script>

<style scoped>

</style>