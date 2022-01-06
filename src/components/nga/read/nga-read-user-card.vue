<template>
  <el-card class="box-card" style="height:100%">
    <template #header>
      <div class="card-header">
        <nga-user-link :uid="uid"/>
        <el-tooltip v-if="!(''+uid).startsWith('#anony_')" effect="light">
          <template #content>
            <el-descriptions :column="2">
              <el-descriptions-item label="声望" v-if="user.reputation">
                <el-tag v-if="user.reputation.value<0" size="small" type="danger">{{ user.reputation.name }}({{ user.reputation.value }})</el-tag>
                <el-tag v-else-if="user.reputation.value<300" size="small" type="warning">{{ user.reputation.name }}({{ user.reputation.value }})</el-tag>
                <el-tag v-else-if="user.reputation.value<600" size="small">{{ user.reputation.name }}({{ user.reputation.value }})</el-tag>
                <el-tag v-else size="small" type="success">{{ user.reputation.name }}({{ user.reputation.value }})</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="威望等级" v-if="user.groupId">
                <el-tag size="small">{{ user.groupName }}({{ user.groupId }})</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="金币" v-if="user.money">
                <el-tag size="small">
                  <nga-money-text :money="user.money"/>
                </el-tag>
              </el-descriptions-item>
              <!--         <el-descriptions-item label="注册" v-if="user.timestamp && user.timestamp.reg">-->
              <!--             <el-tag size="small">{{ user.timestamp.reg.value.split(' ')[0] }}</el-tag>-->
              <!--         </el-descriptions-item>-->
              <el-descriptions-item label="威望" v-if="user.rvrc">
                <el-tag size="small">{{ user.rvrc }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="发帖" v-if="user.postCount">
                <el-tag size="small">{{ user.postCount }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="总赞" v-if="user.totalAgreement">
                <el-tag size="small">{{ user.totalAgreement }}</el-tag>
              </el-descriptions-item>

            </el-descriptions>
          </template>
          <el-button class="button" type="text">更多信息</el-button>
        </el-tooltip>
      </div>
    </template>
    <span v-if="!(''+uid).startsWith('#anony_')">
<!--    非匿名用户 -->
      <span v-if="user.avatar && user.avatar.length>0">
        <my-avatar :list="user.avatar"/>
      </span>

    </span>

  </el-card>
</template>

<script>
import NgaUserLink from "@/components/nga/user/nga-user-link";
import {mapState} from "vuex";
import NgaMoneyText from "@/components/nga/user/nga-money-text";
import MyAvatar from "@/components/nga/user/my-avatar";

export default {
  name: "nga-read-user-card",
  components: {MyAvatar, NgaMoneyText, NgaUserLink},

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

  },
}

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
  background-color: rgb(0 0 0 / 0%);
}

.el-card {
  --el-card-padding: 5px;
  background-color: rgb(0 0 0 / 0%);
}
</style>