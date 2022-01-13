<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header v-if="$route.name!=='已收藏主题'" height="80px">
      <!--      移动端顶部按钮-->
      <div v-if="clientMode==='移动端'" class="space-between" style="text-align: left">
        <span>
          <el-button size="mini" type="success" @click="dialogShow.mobile.subForums=true">子版</el-button>
          <nga-search-dialog v-if="$route.name==='浏览版面主题'" :data="{fid:[forum.fid]}" mode="版面" size="mini" />
          <nga-search-dialog v-if="$route.name==='浏览合集主题'" :data="{stid:[forum.toppedTid]}" mode="合集" size="mini" />
        </span>

        <span>
          <el-button size="mini" type="primary"
                     @click="$router.push({name:'发帖',params:{action:'new'},query:{fid:forum.fid,stid:forum.setName?forum.toppedTid:undefined}})"
          >发帖
          </el-button>

        </span>
      </div>
      <div>
        <my-router-link v-if="forum.toppedTid" :to="{name:'回复列表',params:{tid:forum.toppedTid,page:1}}">
          <h2 style="margin-top: 3px">
            {{ title }}
          </h2>
        </my-router-link>
        <el-switch v-if="clientMode==='PC端'" v-model="showTopicTop" active-text="显示版头" />
      </div>
      <div v-if="clientMode==='PC端'" style="text-align: left">
        <nga-search-dialog v-if="$route.name==='浏览版面主题'" :data="{fid:[forum.fid]}" mode="版面" />
        <nga-search-dialog v-if="$route.name==='浏览合集主题'" :data="{stid:[forum.toppedTid]}" mode="合集" />
        <el-button size="small" type="success" @click="get(true)">
          刷新
        </el-button>
        <el-button size="small" type="primary"
                   @click="$router.push({name:'发帖',params:{action:'new'},query:{fid:forum.fid,stid:forum.setName?forum.toppedTid:undefined}})"
        >
          发帖
        </el-button>
        <el-switch
            v-model="recommend"
            active-text="精华区"
            style="margin-left: 5px"
            @change="changeQuery('recommend',$event)"
        />
        <el-switch
            v-if="!recommend"
            v-model="orderByPostDateDesc"
            active-text="按发布时间排序"
            @change="changeQuery('orderByPostDateDesc',$event)"
        />
      </div>
    </el-header>
    <el-main v-loading="loading" :element-loading-spinner="svg"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-svg-view-box="-10, -10, 50, 50"
             element-loading-text="Loading..."
             style="--el-main-padding:0"
    >

      <div v-if="showTopicTop" id="版头">
        <nga-content :content="topicTopContent" />
      </div>
      <div v-if="clientMode==='PC端'&&forum && forum.children && forum.children.length>0">
        <el-collapse id="subForums">
          <el-collapse-item title="子版面/合集">
            <nga-sub-forum-area :forum="forum" @follow-changed="get(true)" />
          </el-collapse-item>
        </el-collapse>
      </div>
      <thread-table v-if="threads" :pageData="pageData" :threads="threads" @favor-updated="get(true)" />


      <!--      dialog-->

      <el-dialog v-model="dialogShow.mobile.subForums" title="子版面/合集" width="90%">
        <nga-sub-forum-area :forum="forum" @follow-changed="get(true)" />
      </el-dialog>


    </el-main>
    <div v-loading="loading" style="text-align: right">
      <el-affix v-if="clientMode==='移动端'" :offset="20" position="bottom">
        <el-button size="small" type="primary" @click="get(true)">
          <el-icon>
            <refresh-right />
          </el-icon>
        </el-button>
      </el-affix>
    </div>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {setTitle} from "@/assets/request/ProjectUtils";
import ThreadTable from "@/components/nga/thread/thread-table";
import NgaForumAvatar from "@/components/nga/forum/nga-forum-avatar";
import MyRouterLink from "@/components/my/my-router-link";
import {keypressEvent} from "@/assets/utils/DomUtils";
import {ElMessage} from "element-plus";
import {copyObj} from "@/assets/utils/ObjectUtils";
import NgaSubForumArea from "@/components/nga/thread/nga-sub-forum-area";
import NgaContent from "@/components/nga/content/nga-content";
import NgaSearchDialog from "@/components/nga/search/nga-search-dialog";
import {RefreshRight} from "@element-plus/icons";

export default {
  name: "ThreadTab",
  components: {NgaSearchDialog, NgaContent, NgaSubForumArea, MyRouterLink, ThreadTable, NgaForumAvatar, RefreshRight},
  computed: {
    ...mapState('client', [`clientMode`]),
  },
  data() {
    return {
      dialogShow: {
        mobile: {
          subForums: false,
        }
      },
      topicTopContent: "",
      showTopicTop: false,
      loading: false,
      title: "",
      threads: [],
      pageData: {},
      forum: {},
      orderByPostDateDesc: false,
      recommend: false,
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15 " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/> `,
    }
  },

  methods: {
    ...mapActions("thread", [`getThreadsOfSet`, `getThreadsOfForum`, `getFavor`, `getSearchByUser`]),
    ...mapActions("read", [`getTopicTopContent`]),
    ...mapMutations("breadcrumb", [`setWithThread`]),
    ...mapMutations("history", [`addHistoryForum`, `addHistorySet`]),
    changeQuery(key, e) {
      let {name, query} = this.$route
      query = copyObj(query)
      if (e) {
        query[key] = '1'
      } else {
        delete query[key]
      }
      this.$router.push({name, query})
    },
    //浏览版面主题
    async listThreadsOfForum(param) {
      const res = await this.getThreadsOfForum(param)
      const {recommend, fid} = param
      const forum = res.forum
      this.setWithThread({forum, recommend})
      this.addHistoryForum({fid, name: forum.name, recommend})
      this.title = recommend ? `${forum.name}[精华区]` : forum.name
      setTitle(this.title)
      // getTopicTop(fid).then(res=>{console.log(res)})
      return res;
    },
    //浏览合集主题
    async listThreadsOfSet(param) {
      const res = await this.getThreadsOfSet(param)
      const forum = res.forum
      this.setWithThread({forum})
      this.addHistoryForum({fid: forum.fid, name: forum.name})
      this.addHistorySet({stid: forum.toppedTid, name: forum.setName, forumName: forum.name})
      this.title = `${forum.setName} - ${forum.name}`;
      setTitle(this.title)
      return res;
    },
    //查询已收藏主题
    async listFavor(param) {
      const res = await this.getFavor(param)
      this.title = '我的收藏'
      setTitle(this.title)
      return res;
    },
    //搜索用户发言
    async listSearchByUser(param) {
      const res = await this.getSearchByUser(param)
      const {recommend, fid} = param
      const {forum} = res;
      const a = ["用户"];
      if (forum.name) {
        this.setWithThread({forum, recommend})
        this.addHistoryForum({fid, name: forum.name, recommend})
        a.push(`在版面 [${forum.name}]`)
      }
      a.push("发布的")
      if (recommend) {
        a.push('精华主题')
      } else {
        a.push(param.searchpost ? '回复' : '主题')
      }
      this.title = a.join("");
      setTitle(this.title)
      return res;
    },
    //获取数据
    async get(force, route = this.$route) {
      this.loading = true;
      const param = {force, ...route.query, ...route.params,}

      // noinspection NonAsciiCharacters
      const methodMap = {
        "浏览版面主题": this.listThreadsOfForum,
        "搜索用户发言": this.listSearchByUser,
        "浏览合集主题": this.listThreadsOfSet,
        "已收藏主题": this.listFavor,
      }
      let method = methodMap[route.name];
      if (method) {
        const res = await method(param)
        console.log(res)
        this.loading = false;
        if (res) {
          this.threads = res.threads
          this.pageData = res.pageData
          this.forum = res.forum
          if (force) {
            ElMessage.success("刷新成功")
          }
          if (this.forum.toppedTid) {
            this.getTopicTopContent({tid: this.forum.toppedTid}).then(res => {
              this.topicTopContent = res
            })
          }
        }
      }
    },
    keypress(e) {
      const methods = {
        r: () => this.get(true),
      }
      keypressEvent(e, methods)
    },
  },
  mounted() {
    setTitle(this.$route.name)
    document.addEventListener('keypress', this.keypress)
    this.get(false)

    console.log(this.$route)

    this.orderByPostDateDesc = this.$route.query.orderByPostDateDesc === '1'
    this.recommend = this.$route.query.recommend === '1'
  },
  unmounted() {
    document.removeEventListener('keypress', this.keypress)
  },

  watch: {
    $route(to, from) {
      this.orderByPostDateDesc = this.$route.query.orderByPostDateDesc === '1'
      this.recommend = this.$route.query.recommend === '1'
      if (to.path.startsWith('/thread')) {
        this.get(false, to).catch(reason => {
          console.error(reason)
          this.loading = false
          this.$router.push(from)
        })
      }
    }
  },
  props: {},
}

</script>

<style scoped>
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>