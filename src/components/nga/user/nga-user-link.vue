<template>
  <span v-if="(''+uid).startsWith('#anony_')">
    <el-tag effect="dark" size="mini" type="danger">匿名</el-tag>
    {{ getAnonyName(uid) }}
  </span>
  <span v-else-if="uid==='[未知用户]'">未知用户</span>
  <el-tooltip v-else :disabled="disabled" effect="light" placement="right">
    <template #content>
      <el-button :size="size" :type="type"
                 v-clipboard:copy="uid"
                 v-clipboard:error="onError"
                 v-clipboard:success="onCopy"
      >复制UID
      </el-button>
      <el-button v-clipboard:copy="`[@${uid}]`" v-clipboard:error="onError"
                 v-clipboard:success="onCopy"
                 :size="size"
                 :type="type"
      >复制@代码
      </el-button>
      <el-button :size="size" :type="type" @click="$router.push({name:'短消息发起',query:{to:uid}})">
        私信
      </el-button>
      <br>
      <el-button :size="size" :type="type" style="margin-top: 3px"
                 @click="open(`${domain}nuke.php?func=ucp&uid=${uid}`)"
      >打开官方用户中心
      </el-button>

    </template>
  <my-router-link :to="{name: '用户中心',params:{uid}}">
    <span v-if="text">{{text}}</span>
    <span v-else-if="users[uid]">{{users[uid].username}}</span>
    <slot v-else-if="$slots.defalut"/>
    <span v-else>UID:{{uid}}</span>
  </my-router-link>
  </el-tooltip>
</template>

<script>
import MyRouterLink from "@/components/my/my-router-link";
import {mapState} from "vuex";
import {ElMessage} from "element-plus";
import {getAnonyName} from "@/assets/request/anonyName";
import {domain} from "@/assets/request/nga-request";

export default {
  name: "nga-user-link",
  components: {MyRouterLink},
  data() {
    return {
      size: "small",
      type: "primary",
      domain
    }
  },
  computed: {
    ...mapState("users",[`users`]),
  },
  methods: {
    getAnonyName,
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
    uid: {}, text: {}, disabled: {default: false, type: Boolean}
  },
}

</script>

<style scoped>

</style>