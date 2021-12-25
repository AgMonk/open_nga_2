<!--用户链接-->
<template>
  <el-tooltip effect="light" placement="right">
    <template #content>
      <el-button type="primary" size="small"
                 v-clipboard:copy="uid"
                 v-clipboard:error="onError"
                 v-clipboard:success="onCopy"
      >复制UID</el-button>
      <br>
      <el-button style="margin-top: 3px" type="primary" size="small"
                 @click="open(`https://bbs.nga.cn/nuke.php?func=ucp&uid=${uid}`)"
      >打开官方用户中心</el-button>
    </template>
      <router-link :to="`/user/${uid}`">
    <el-link :underline="false" :style="style">
        {{ username ? username : `UID:${uid}` }}
    </el-link>
      </router-link>
  </el-tooltip>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "my-user-link",
  data() {
    return {}
  },
  methods: {
    open(url){
      window.open(url)
    },
    onCopy() {
      ElMessage.success("复制成功")
    },
    onError(e) {
      ElMessage.error("复制失败")
      console.error(e)
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    uid: {
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
a {
  text-decoration: none;
}
</style>