<!--用户中心-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <el-descriptions :column="clientMode==='PC端'?4:2" border>
        <template #title>
          <nga-user-link v-if="data.uid" :uid="data.uid" style="font-size: 20px" />
        </template>
        <template #extra>
          <el-button size="small" type="primary" @click="$router.push({name:'短消息发起',query:{to:data.uid}})">
            私信
          </el-button>
        </template>
        <el-descriptions-item label="UID">{{ data.uid }}</el-descriptions-item>
        <el-descriptions-item v-if="data.money" label="金钱">
          <nga-money-text :money="data.money" />
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
          <h3>头像</h3>
        </template>
        <el-descriptions-item v-if="data.avatar">
          <my-avatar v-for="(i) in data.avatar.length" :index="i-1" :list="data.avatar" />
        </el-descriptions-item>
        <el-descriptions-item v-else>
          无
        </el-descriptions-item>

      </el-descriptions>
      <el-descriptions border :column="1">
        <template #title>
          <h3>签名</h3>
        </template>
        <el-descriptions-item v-if="data.signature">
          <nga-signature :uid="data.uid" />
        </el-descriptions-item>
        <el-descriptions-item v-else>
          无
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <template #title>
          <h3>发言</h3>
        </template>
        <el-descriptions-item align="left">
          <el-button size="small" type="success" @click="$router.push({name:'搜索用户发言',params:{page:1,authorid:data.uid}})">用户主题</el-button>
          <el-button size="small" type="success" @click="$router.push({name:'搜索用户发言',params:{page:1,authorid:data.uid},query:{searchpost:1}})">用户回复</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import MyAvatar from "@/components/nga/user/my-avatar";
import NgaUserLink from "@/components/nga/user/nga-user-link";
import NgaMoneyText from "@/components/nga/user/nga-money-text";
import NgaSignature from "@/components/nga/read/nga-signature";
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";

export default {
  name: "user-center",
  components: {MyTagWithTooltip, NgaSignature, NgaMoneyText, NgaUserLink, MyAvatar},
  data() {
    return {
      data: {},
    }
  },
  methods: {
    ...mapActions("users", [`getUserInfo`]),
  },
  computed: {
    ...mapState('client', [`clientMode`]),
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
.el-main {
  --el-main-padding: 0;
  overflow-y: hidden;
}
</style>