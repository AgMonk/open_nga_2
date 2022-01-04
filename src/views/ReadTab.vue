<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="margin-top: 3px">
      <el-tooltip :disabled="!forum || !forum.reputationLevel" effect="light">
        <template #content>
          <span v-for="(item,i) in forum.reputationLevel">
            <el-tag>{{ item.n }}({{ item.r }})</el-tag>
            <br v-if="i%4===1"/>
          </span>
        </template>
        <el-button size="small" type="primary">声望阈值</el-button>
      </el-tooltip>
      <el-button size="small" type="success" @click="get(true)">刷新</el-button>
      <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:thread.tid}}">
        <el-button size="small" type="primary">回复</el-button>
      </my-router-link>

    </el-header>

    <el-main v-loading="loading" :element-loading-spinner="svg"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-svg-view-box="-10, -10, 50, 50"
             element-loading-text="Loading...">
      <nga-read-table :page-data="pageData" :replies="replies" :thread="thread"/>
    </el-main>
  </el-container>

</template>

<script>
import {mapActions, mapMutations} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";
import NgaReadTable from "@/components/nga/read/nga-read-table";
import {ElMessage} from "element-plus";
import {keypressEvent, scrollYToTop} from "@/assets/utils/DomUtils";
import MyRouterLink from "@/components/my/my-router-link";

export default {
  name: "ReadTab",
  components: {MyRouterLink, NgaReadTable},
  data() {
    return {
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15 " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/> `,
      pageData: {
        total: 100,
        currentPage: 1,
        pageSize: 20,
      },
      loading: false,
      replies: [],
      thread: {},
      forum: {},
    }
  },
  methods: {
    ...mapActions("read", [`getReplies`]),
    ...mapMutations("history", [`addHistoryThread`, `addHistoryForum`, `addHistorySet`]),
    ...mapActions("users", [`getUserInfo`]),
    async get(force) {
      this.loading = true;
      const {pid, tid, page, authorid} = Object.assign({}, this.$route.query, this.$route.params)
      const data = await this.getReplies({pid, tid, page, authorid, force})
      const {forum, thread} = data;
      const subForum = thread.subForum
      console.log(data);
      setTitle(forum.name)

      this.pageData = data.pageData;
      this.replies = data.replies;
      this.forum = data.forum;
      this.thread = data.thread;

      //请求用户数据
      data.userData.users
          .filter(user => !isNaN(user.uid))
          // .filter(user=>!user.username.startsWith('UID'))
          .forEach(user => {
            this.getUserInfo(user.uid)
          })

      this.addHistoryThread({tid, name: thread.subject})
      this.addHistoryForum({fid: thread.fid, name: forum.name})
      if (subForum) {
        this.addHistorySet({stid: subForum.tid, name: subForum.subject, forumName: forum.name})
      }

      if (force) {
        ElMessage.success("刷新成功")
      }
      this.loading = false;

    },
    keypress(e) {
      const methods = {
        r: () => this.get(true),
        R: () => this.$router.push({name: '发帖', params: {action: 'reply'}, query: {tid: this.thread.tid}}),
        Q: () => {
          const {subForum, fid} = this.thread
          if (subForum) {
            this.$router.push({name: "浏览合集主题", params: {stid: subForum.tid, page: 1}})
          } else {
            this.$router.push({name: "浏览版面主题", params: {fid, page: 1}})
          }
        },
      }
      keypressEvent(e, methods)
    },
  },
  mounted() {
    setTitle(this.$route.name)
    this.get(false)

    document.addEventListener('keypress', this.keypress)

  },
  unmounted() {
    document.removeEventListener('keypress', this.keypress)
  },
  watch: {
    $route(to, from) {
      // console.log(to)
      if (to.path.startsWith('/read')) {
        if (!to.hash) {
          scrollYToTop()
        }
        this.get(false, to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>