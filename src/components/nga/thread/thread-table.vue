<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
<!--    <el-header></el-header>-->

    <el-main>
      <div style="text-align: left">
        <el-button v-if="$route.name==='已收藏主题'" type="danger" @click="delFavor">取消收藏</el-button>
      </div>
      <el-pagination v-if="pageData"
                     :current-page.sync="currentPage"
                     :layout="(clientMode==='PC端'?'total':'')+',prev, pager, next,jumper'"
                     :pager-count="clientMode==='PC端'?5:3"
                     @current-change="currentChange"
                     :page-size="pageSize"
                     :total="total"
      />
      <el-table :data="threads"
                :header-cell-style="getHeaderRowStyle"
                :header-row-style="getHeaderRowStyle"
                :row-style="getRowStyle()"
                style="width: 100%"
                @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="$route.name==='已收藏主题'" type="selection" />
        <el-table-column v-if="$route.name!=='已收藏主题' && clientMode==='PC端'" label="#" width="40px">
          <template #default="s">
            {{ s.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column v-if="$route.name!=='已收藏主题' && clientMode==='PC端'" label="回复" prop="replies" width="70px">
          <template #default="s">
            <span v-if="s.row.mirror && ['版面','合集'].includes(s.row.mirror.type)">
              {{ s.row.mirror.type }}
            </span>
            <span v-else>{{ s.row.replies }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="主题">
          <template #default="s">
            <thread-row :data="s.row" />
            <div v-if="clientMode==='移动端'" style="display: flex; justify-content: space-between; align-items: center;">
              <nga-user-link :uid="s.row.author.uid" />
              <span @click="$router.push({name:'回复列表',params:{tid:s.row.tid,page:'e'}})">
                <my-timestamp :time="s.row.timestamp.lastPost.time" />
                ({{ s.row.replies }})</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column v-if="$route.name!=='已收藏主题'&& clientMode==='PC端'" label="作者" prop="author.name" width="180">
          <template #default="s">
            <nga-user-link :uid="s.row.author.uid" />
            <div>
              <my-timestamp :time="s.row.timestamp.post.time" />
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="$route.name==='已收藏主题'&& clientMode==='PC端'" label="作者" prop="author.name" width="180">
          <template #default="s">
            <nga-user-link :uid="s.row.reply?s.row.reply.authorId:s.row.author.uid" />
            <div>
              <my-timestamp :time="s.row.reply?s.row.reply.timestamp.post.time:s.row.timestamp.post.time" />
            </div>
          </template>
        </el-table-column>

        <el-table-column v-if="$route.name!=='已收藏主题' && clientMode==='PC端'" label="最后回复" prop="lastposter" width="180">
          <template #default="s">
            <div>
              <my-timestamp :time="s.row.timestamp.lastPost.time" />
            </div>
            {{ s.row.lastposter }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="pageData"
                     :current-page.sync="currentPage"
                     :layout="(clientMode==='PC端'?'total':'')+',prev, pager, next,jumper'"
                     :pager-count="clientMode==='PC端'?5:3"
                     @current-change="currentChange"
                     :page-size="pageSize"
                     :total="total"
      />
      <div style="text-align: left">
        <el-button v-if="$route.name==='已收藏主题'" type="danger" @click="delFavor">取消收藏</el-button>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import ThreadRow from "@/components/nga/thread/thread-row";
import NgaUserLink from "@/components/nga/user/nga-user-link";
import MyTimestamp from "@/components/my/my-timestamp";
import {ElMessage, ElMessageBox} from "element-plus";
import {delFavor} from "@/assets/request/nuke-request";
import {mapGetters, mapState} from "vuex";

export default {
  name: "thread-table",
  components: {MyTimestamp, NgaUserLink, ThreadRow},
  computed: {
    ...mapState('config', ["config"]),
    ...mapState('client', [`clientMode`]),
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 100,
      total: 100,
      selection: [],
    }
  },
  emits: ['favor-updated'],
  methods: {
    ...mapGetters('config', [`getHeaderRowStyle`, `getRowStyle`]),
    delFavor() {
      if (!this.selection || this.selection.length === 0) {
        ElMessage.error("未选中任何主题")
        return;
      }
      const page = this.currentPage;
      const tidarray = this.selection.join(',')
      ElMessageBox.confirm('确认取消收藏', {
        title: '确认取消收藏',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFavor({page, tidarray}).then(res => {
          ElMessage.success(res.data["0"])
          this.$emit('favor-updated')
        })
      }).catch(reason => {
        ElMessage.info("已取消")
        console.log(reason)
      })
    },
    handleSelectionChange(value) {
      console.log(value)
      this.selection = value.map(i => {
        const {reply} = i;
        if (reply) {
          return `${i.tid}_${reply.pid}`
        }
        return i.tid
      })
      console.log(this.selection)
    },
    currentChange(e) {
      const {name, params, query} = this.$route
      params.page = e;
      this.currentPage = e
      this.$router.push({name, params, query})
    },
    update(e = this.pageData) {
      this.currentPage = parseInt(e.currentPage)
      this.total = parseInt(e.total)
      this.pageSize = parseInt(e.pageSize)
    }
  },
  mounted() {
    this.update()

  },
  watch: {
    pageData(e) {
      this.update(e)
    },
  },
  props: {
    threads: {
      type: Object,
      required: true,
    },
    pageData: {
      type: Object,
      required: true,
    },
  },
}

</script>

<style scoped>
.el-pagination {
  --el-pagination-bg-color: rgb(0 0 0 / 0%);
  --el-pagination-button-disabled-bg-color: rgb(0 0 0 / 0%);
}

.el-pager li {
  background: rgb(0 0 0 / 0%);
}

.el-main {
  --el-main-padding: 0;
  overflow-y: hidden;
}
</style>