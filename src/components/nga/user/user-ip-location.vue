<template>
  <el-tag size="small" v-if="uid && users[uid]" type="warning" effect="dark" style="padding:0 3px">
    {{users[uid].ipLoc}}
  </el-tag>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "user-ip-location",
  data() {
    return {
      showDialog: {},
      loading: {},
      params: {
        filter: {},
        page: 1,
        size: 10,
      },
      form: {},
      data: [],
      total: 10,
    }
  },
  computed: {
    ...mapState("users",[`users`]),
  },
  methods: {
    load(route, force) {

    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {

    }
  },
  props: {
    uid: {},
  },
}

</script>

<style scoped>

</style>