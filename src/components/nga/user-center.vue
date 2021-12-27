<!--用户中心-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <el-descriptions border>
        <template #title>
          <my-user-link :uid=data.uid :username="data.username" :style="{'font-size':'20px'}"/>
        </template>
        <template #extra>操作区</template>
        <el-descriptions-item label="UID">{{ data.uid }}</el-descriptions-item>
        <el-descriptions-item v-if="data.money" label="金钱">
          {{ data.money.gold }}
          <span style="color:yellow;font-weight: bold">金</span>
          {{ data.money.silver }}
          <span style="color:blue;font-weight: bold">银</span>
          {{ data.money.copper }}
          <span style="color:coral;font-weight: bold">铜</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="data.rvrc" label="威望">{{ data.rvrc }}</el-descriptions-item>
        <el-descriptions-item v-if="data.totalAgreement" label="总赞数">{{ data.totalAgreement }}</el-descriptions-item>
        <el-descriptions-item v-if="data.accountStatus" label="状态">{{ data.accountStatus.status }}({{ data.accountStatus.verified }})</el-descriptions-item>
        <el-descriptions-item v-if="data.postCount" label="发帖">{{ data.postCount }}</el-descriptions-item>
        <el-descriptions-item v-if="data.groupId" label="用户组">{{ data.groupName }}({{ data.groupId }})</el-descriptions-item>
        <el-descriptions-item v-if="data.email" label="email">{{ data.email }}</el-descriptions-item>
        <el-descriptions-item v-if="data.phone" label="手机">{{ data.phone }}</el-descriptions-item>
        <template v-if="data.timestamp">
          <el-descriptions-item v-if="data.timestamp.reg" label="注册时间">{{ data.timestamp.reg.value }}</el-descriptions-item>
          <el-descriptions-item v-if="data.timestamp.mute" label="被禁言"><span style="color:red;font-weight: bold">{{ data.timestamp.mute.value }}</span></el-descriptions-item>
        </template>
      </el-descriptions>

      <el-descriptions border :column="1">
        <template #title>
          头像
        </template>
        <el-descriptions-item v-if="data.avatar">
          <my-avatar v-for="(i) in data.avatar.length-1" :list="data.avatar" :index="i" />
        </el-descriptions-item>
        <el-descriptions-item v-else>
          无
        </el-descriptions-item>

      </el-descriptions>
      <el-descriptions border :column="1">
        <template #title>
          签名
        </template>
        <el-descriptions-item v-if="data.signature">
          {{ data.signature }}
<!--          todo 解析签名论坛代码 -->
        </el-descriptions-item>
        <el-descriptions-item v-else>
          无
        </el-descriptions-item>
      </el-descriptions>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import MyUserLink from "@/components/nga/my-user-link";
import MyAvatar from "@/components/nga/my-avatar";

export default {
  name: "user-center",
  components: {MyAvatar, MyUserLink},
  data() {
    return {
      data: {},
    }
  },
  methods: {
    ...mapActions("users", [`getUserInfo`]),
  },
  computed: {
    ...mapState("users", [`currentUser`])
  },
  async mounted() {
    if (this.uid) {
      this.data = await this.getUserInfo(this.uid)
    } else {
      this.data = this.currentUser;
    }
  },
  watch: {
    async uid(to, from) {
      if (to) {
        this.data = await this.getUserInfo(to)
      }
    },
    currentUser(to, from) {
      if (!this.uid) {
        this.data = to
      }
    },
  },
  props: {
    uid: {}
  },
}

</script>

<style scoped>

</style>