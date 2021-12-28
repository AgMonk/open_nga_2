<template>
  <span v-if="(''+uid).startsWith('#anony_')">匿名用户{{(''+uid).substring(7,13)}}</span>
  <el-tooltip v-else effect="light" placement="right">
    <template #content>
      <el-button type="primary" size="small"
                 v-clipboard:copy="uid"
                 v-clipboard:error="onError"
                 v-clipboard:success="onCopy"
      >复制UID
      </el-button>
      <br>
      <el-button style="margin-top: 3px" type="primary" size="small"
                 @click="open(`https://bbs.nga.cn/nuke.php?func=ucp&uid=${uid}`)"
      >打开官方用户中心
      </el-button>
    </template>
  <my-router-link :to="{name: '用户中心',params:{uid}}">
    <span v-if="text">{{text}}</span>
    <span v-else-if="users[uid]">{{users[uid].username}}</span>
    <span v-else>UID:{{uid}}</span>
  </my-router-link>
  </el-tooltip>
</template>

<script>
import MyRouterLink from "@/components/my/my-router-link";
import {mapState} from "vuex";
import {ElMessage} from "element-plus";
export default {
  name: "nga-user-link",
  components: {MyRouterLink},
  data() {
    return {}
  },
  computed: {
    ...mapState("users",[`users`]),
  },
  methods: {
    open(url) {
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
    uid:{},text:{}
  },
}

</script>

<style scoped>

</style>