<!--我的账号管理-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="addAccounts">添加</el-button>
      <el-button type="primary" @click="showDialog=true">cookie获取方法</el-button>
    </el-header>

    <el-main>
      <el-table :data="accounts">
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="操作">
          <template #default="slot">
            <el-button type="primary" @click="login(slot.row.cookie)">登陆</el-button>
            <el-button type="danger" @click="del(slot.row)">移除</el-button>
          </template>

        </el-table-column>
      </el-table>
      <el-dialog v-model="showDialog" close-on-click-modal width="80%">
        <div style="text-align: left">
          <ol>
            <li>本UI没有常规登陆功能，需要使用已登陆的账号Cookie</li>
            <li>以chrome为例，其他浏览器大同小异，界面有可能是中文，自行对应</li>
            <li>打开一个新标签，按F12打开控制台，点击“Network”或“网络”，使用该标签打开任一一个帖子后如下图操作</li>
            <li>
              <el-image :src="cookieImg" />
            </li>
          </ol>
        </div>
      </el-dialog>
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
    return {
      showDialog: false,
      cookieImg: require('@/assets/image/cookie.png'),
    }
  },
  computed: {
    ...mapState("users", [`accounts`]),
  },
  methods: {
    ...mapActions("users", [`getUserInfo`, `loginWithCookie`]),
    ...mapMutations("users", [`loadAccounts`, `delAccount`]),
    login(cookie){
      this.loginWithCookie(cookie).then(()=>{
        setTimeout(() => {
          location.reload()
        }, 500)
      })
    },
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