<template>
  <el-row>
    <el-col :span="4">
      <my-avatar v-if="user" :list="user.avatar" />
    </el-col>
    <el-col :span="20" style="text-align: left;font-size: 12px">
      <div class="space-between">
        <nga-user-link :uid="uid" />
        <span v-if="user">
          发帖:
          <el-tag size="small">{{ user.postCount }}</el-tag>
          总赞：
          <el-tag size="small">{{ user.totalAgreement }}</el-tag>
        </span>
      </div>
      <div v-if="user">
        威望:
        <el-tag size="small">{{ user.rvrc }}</el-tag>
        <el-tag v-if="user.groupId" size="small">{{ user.groupName }}({{ user.groupId }})</el-tag>
        <nga-user-reputation-tag :reputation="user.reputation" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import NgaUserLink from "@/components/nga/user/nga-user-link";
import {mapState} from "vuex";
import NgaMoneyText from "@/components/nga/user/nga-money-text";
import MyAvatar from "@/components/nga/user/my-avatar";
import NgaUserReputationTag from "@/components/nga/user/nga-user-reputation-tag";

export default {
  name: "nga-read-user-card-mobile",
  components: {NgaUserReputationTag, MyAvatar, NgaMoneyText, NgaUserLink},

  data() {
    return {
      user: {},
    }
  },
  computed: {
    ...mapState("users", [`users`]),
  },
  methods: {
    update(e) {
      this.user = this.users[e]
    },
  },
  mounted() {
    this.update(this.uid)
  },
  watch: {
    uid(to) {
      this.update(to)
    }
  },
  props: {
    uid: {
      required: true,
    },
    disableAvatar: {type: Boolean, default: false}
  },
}

</script>

<style scoped>
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>