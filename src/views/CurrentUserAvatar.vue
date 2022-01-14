<template>
  <el-badge style="position: fixed; top: 0; right: 0;">
    <el-dropdown @command="command">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in dropdownItems" :command="item.toRoute">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
      <el-avatar :size="50" :src="avatarUrl" />
    </el-dropdown>
  </el-badge>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "CurrentUserAvatar",
  data() {
    return {
      avatarUrl: "",
      dropdownItems: [],
    }
  },
  computed: {
    ...mapState("users", [`currentUser`]),
  },
  methods: {
    command(e) {
      this.$router.push(e)
    }
  },
  mounted() {
    const {avatar, uid} = this.currentUser
    let random = Math.floor(Math.random() * avatar.length)
    this.avatarUrl = avatar[random]
    this.dropdownItems = [
      {name: "用户中心", toRoute: {name: '用户中心', params: {uid}}},
      {name: "我的主题", toRoute: {name: '搜索用户发言', params: {authorid: uid, page: 1}}},
      {name: "我的回复", toRoute: {name: '搜索用户发言', params: {authorid: uid, page: 1}, query: {searchpost: 1}}},
      {name: "短消息", toRoute: {name: '短消息列表', params: {page: 1}}},
      {name: "收藏", toRoute: {name: '已收藏主题', params: {page: 1}}},
    ]
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>