<!--我的账号管理-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="addAccounts">添加</el-button>
    </el-header>

    <el-main>
      <el-table :data="accounts">
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="操作">
          <template #default="slot">
            <el-button type="primary" @click="loginWithCookie(slot.row.cookie)">登陆</el-button>
            <el-button type="danger" @click="del(slot.row)">移除</el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {ElMessage, ElMessageBox} from "element-plus";
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  name: "my-accounts",
  data() {
    return {}
  },
  computed: {
    ...mapState("users", [`accounts`]),
  },
  methods: {
    ...mapActions("users", [`getUserInfo`, `loginWithCookie`]),
    ...mapMutations("users", [`loadAccounts`, `delAccount`]),
    addAccounts() {
      ElMessageBox.prompt('请填写Cookie', '添加账号', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(({value}) => {
        this.loginWithCookie(value)
      }).catch(reason => {
        ElMessage.info("已取消")
        console.log(reason)
      })
    },
    del(user) {
      ElMessageBox.confirm(
          `确认移除该账号： ${user.username}`,
          '确认删除',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: '确认删除',
          }
      )
          .then(() => {
            this.delAccount(user.uid)
          })
          .catch(reason => {
            ElMessage.info("已取消")
            console.log(reason)
          })
    }
  },
  mounted() {
    this.loadAccounts();
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>