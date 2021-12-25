<!--用户链接-->
<template>
  <el-tooltip effect="light" placement="right">
    <template #content>
      <el-button type="primary" size="small" @click="">复制UID</el-button>
      <br>
      <el-button style="margin-top: 3px" type="primary" size="small" @click="">打开官方用户中心</el-button>
    </template>
      <router-link :to="`/user/${uid}`">
    <el-link :underline="false" :style="style">
        {{ username ? username : `UID:${username}` }}
    </el-link>
      </router-link>
  </el-tooltip>
</template>

<script>
export default {
  name: "my-user-link",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    uid: {
      type: Number,
      required: true,
    },
    username: {},
    style: {},
  },
}

</script>

<style scoped>
.router-link-active {
  text-decoration: none;

}
</style>