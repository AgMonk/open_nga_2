<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header v-if="clientMode==='PC端'" style="margin-top: 3px">
      <el-tooltip :disabled="!forum || !forum.reputationLevel" effect="light">
        <template #content>
          <span v-for="(item,i) in forum.reputationLevel">
            <el-tag>{{ item.n }}({{ item.r }})</el-tag>
            <br v-if="i%4===1" />
          </span>
        </template>
        <el-button size="small" style="margin-right: 10px" type="primary">声望阈值</el-button>
      </el-tooltip>
      <nga-search-dialog v-if="thread.subForum" :data="{stid:[thread.subForum.tid]}" mode="合集" />
      <nga-search-dialog v-else :data="{fid:[thread.fid]}" mode="版面" />
      <el-button size="small" style="margin-right: 10px" type="success" @click="get(true)">刷新</el-button>
      <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:thread.tid}}">
        <el-button size="small" type="primary">回复</el-button>
      </my-router-link>
      <el-switch v-model="config.autoRefresh" active-text="自动刷新(3min)" @change="setConfig({key:'autoRefresh',value:$event})" />

    </el-header>

    <el-main v-loading="loading" :element-loading-spinner="svg" element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-svg-view-box="-10, -10, 50, 50"
             element-loading-text="Loading..."
             style="--el-main-padding:0;overflow-y:hidden;"
    >
      <nga-read-table :page-data="pageData" :replies="replies" :thread="thread" />
    </el-main>


    <div v-loading="loading" style="text-align: right">
      <el-affix v-if="clientMode==='移动端'" :offset="20" position="bottom">
        <div>
          <nga-jump-page-button :page-data="pageData" />
          <el-button size="small" type="success" @click="$router.push({name:'发帖',params:{action:'reply'},query:{tid:thread.tid}})">
            <el-icon>
              <chat-square />
            </el-icon>
          </el-button>
        </div>
        <div style="margin-top: 5px">
          <el-button size="small" type="primary" @click="jump(pageData.currentPage-1)">上</el-button>
          <el-button size="small" type="primary" @click="jump(pageData.currentPage+1)">下</el-button>

          <el-button size="small" type="primary" @click="keypress({key:'Q'})">
            <el-icon>
              <arrow-left />
            </el-icon>
          </el-button>

          <el-button size="small" type="primary" @click="get(true)">
            <el-icon>
              <refresh-right />
            </el-icon>
          </el-button>

        </div>
      </el-affix>

    </div>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";
import NgaReadTable from "@/components/nga/read/nga-read-table";
import {ElMessage} from "element-plus";
import {keypressEvent, scrollYToTop} from "@/assets/utils/DomUtils";
import MyRouterLink from "@/components/my/my-router-link";
import NgaSearchDialog from "@/components/nga/search/nga-search-dialog";
import {ArrowLeft, ChatSquare, RefreshRight} from "@element-plus/icons";
import NgaJumpPageButton from "@/components/nga/read/nga-jump-page-button";

export default {
  name: "ReadTab",
  components: {NgaJumpPageButton, NgaSearchDialog, MyRouterLink, NgaReadTable, RefreshRight, ChatSquare, ArrowLeft},
  computed: {
    ...mapState('client', [`clientMode`]),
    ...mapState('config', ["config"]),
  },
  data() {
    return {
      refreshInterval: '',

      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15 " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/> `,
      pageData: {
        total: 100,
        currentPage: 1,
        pageSize: 20,
      },
      loading: false,
      pageDialogShow: false,
      replies: [],
      thread: {},
      forum: {},
    }
  },
  methods: {
    ...mapActions("read", [`getReplies`]),
    ...mapMutations("history", [`addHistoryThread`, `addHistoryForum`, `addHistorySet`]),
    ...mapMutations('config', [`setConfig`]),
    ...mapMutations('breadcrumb', [`setWithRead`]),
    ...mapActions("users", [`getUserInfo`]),
    async get(force) {
      this.loading = true;
      const {pid, tid, page, authorid} = Object.assign({}, this.$route.query, this.$route.params)
      const data = await this.getReplies({pid, tid, page, authorid, force: page === 'e' ? true : force})
      this.setWithRead(data)

      const {forum, thread} = data;
      const subForum = thread.subForum
      console.log(data);
      setTitle(forum.name)

      this.pageData = data.pageData;
      this.replies = data.replies;
      this.forum = data.forum;
      this.thread = data.thread;

      console.log(this.forum)
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
      await this.$nextTick(() => {
        this.loading = false
      })
    },
    jump(page) {
      page = page < 1 ? 1 : page;
      page = page > this.pageData.totalPage ? this.pageData.totalPage : page;
      this.$router.push({params: {page}})
      this.show = false;
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
    this.refreshInterval = setInterval(() => {
      if (this.config.autoRefresh) {
        this.get(true)
      }
    }, 1000 * 60 * 3);

  },
  unmounted() {
    document.removeEventListener('keypress', this.keypress)
    clearInterval(this.refreshInterval)
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