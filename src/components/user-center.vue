<!--用户中心-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <el-descriptions title="User Info" border>
        <template #title>
          <my-user-link :uid=data.uid :username="data.username" :style="{'font-size':'20px'}" />
        </template>
        <template #extra>操作区</template>
        <el-descriptions-item label=""></el-descriptions-item>

      </el-descriptions>

      {{data}}
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import MyUserLink from "@/components/my/my-user-link";

export default {
  name: "user-center",
  components: {MyUserLink},
  data() {
    return {
      data: {},
    }
  },
  methods: {
    ...mapActions("users",[`getUserInfo`]),
  },
  computed: {
    ...mapState("users",[`currentUser`])
  },
  async mounted() {
    if (this.uid) {
      this.data = await this.getUserInfo(this.uid)
    }else{
      this.data = this.currentUser;
    }
  },
  watch: {
    async uid(to, from) {
      if (to) {
        this.data = await this.getUserInfo(to)
      }
    },
    currentUser(to,from){
      if (!this.uid) {
        this.data = to
      }
    }
  },
  props: {
    uid:{}
  },
}

</script>

<style scoped>

</style>