<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <nga-user-link :uid="uid"/>
        <el-button class="button" type="text">Operation button</el-button>
      </div>
    </template>
    <span v-if="!(''+uid).startsWith('#anony_')">
<!--    非匿名用户 -->
      <span>
        <my-avatar v-if="user.avatar && user.avatar.length>0" :list="user.avatar"/>
      </span>
       <el-descriptions :column="2">
         <el-descriptions-item label="声望" v-if="user.reputation">
             <el-tag size="small">{{ user.reputation.name }}({{ user.reputation.value }})</el-tag>
         </el-descriptions-item>
         <el-descriptions-item label="威望等级" v-if="user.groupId">
           <el-tag size="small">{{ user.groupName }}({{ user.groupId }})</el-tag>
         </el-descriptions-item>
         <el-descriptions-item label="金币" v-if="user.money">
                        <el-tag size="small"> <nga-money-text :money="user.money"/></el-tag>
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
}

.el-card {
  --el-card-padding: 10px;
}
</style>