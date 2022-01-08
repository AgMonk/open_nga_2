<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in breadcrumbs" :to="getRoute(item)">
      <el-dropdown size="small" split-button type="primary" @command="command">
        {{ item.name }}
        <template v-if="['版面','合集','主题'].includes(item.type)" #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="i in forums" v-if="item.type==='版面'" :command="i" class="history-item">{{ i.name }}</el-dropdown-item>
            <el-dropdown-item v-for="i in favorsForums" v-if="item.type==='版面'" :command="i" class="favor-item">{{ i.name }}</el-dropdown-item>
            <el-dropdown-item v-for="i in sets" v-if="item.type==='合集'" :command="i" class="history-item">{{ i.name }}</el-dropdown-item>
            <el-dropdown-item v-for="i in favorsSets" v-if="item.type==='合集'" :command="i" class="favor-item">{{ i.name }}</el-dropdown-item>
            <el-dropdown-item v-for="i in threads" v-if="item.type==='主题'" :command="i">{{ i.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "nga-breadcrumb",
  data() {
    return {
      favorsForums: [],
      favorsSets: [],
    }
  },
  computed: {
    ...mapState('breadcrumb', [`breadcrumbs`]),
    ...mapState('history', [`forums`, `threads`, `sets`])
  },
  methods: {
    ...mapActions('forums', [`getFavorForums`]),
    command(c) {
      const {fid, tid, stid, recommend} = c;
      if (fid) {
        this.$router.push({name: '浏览版面主题', query: {recommend}, params: {fid, page: 1}})
      } else if (stid) {
        this.$router.push({name: '浏览合集主题', params: {stid, page: 1}})
      } else if (tid) {
        this.$router.push({name: '回复列表', params: {tid, page: 1}})
      } else {
        console.error(c)
      }

    },
    getRoute(item) {
      const {fid, stid, tid} = item
      switch (item.type) {
        case'版面':
          return `/thread/f/${fid}/1`;
        case'合集':
          return `/thread/s/${stid}/1`;
        case'主题':
          return `/read/t/${tid}/1`;
        case'精华区':
          return `/thread/f/${fid}/1?recommend=1`;
        default:
          break;
      }
    },
    //在面包屑里添加收藏里的 版面 、 合集
    async updateFavor(forums = this.forums, sets = this.sets) {
      const res = await this.getFavorForums(false)
      const list = res.data.favorForums;

      const historyFid = forums.map(i => parseInt(i.fid))
      this.favorsForums = list.filter(i => !i.stid).filter(i => !historyFid.includes(i.fid))
      // console.log(this.favorsForums)

      const historyStid = sets.map(i => parseInt(i.stid))
      this.favorsSets = list.filter(i => i.stid).filter(i => !historyStid.includes(i.stid))
      // console.log(this.favorsSets)
    },
  },
  async mounted() {
    await this.updateFavor()
  },
  watch: {
    async forums(to) {
      await this.updateFavor(to)
    },
    async sets(to) {
      await this.updateFavor(undefined, to)
    },

  },
  props: {},
}

</script>

<style scoped>
.history-item {
  background-color: rgba(66, 185, 131, 0.45)
}

.favor-item {
  background-color: rgba(125, 162, 250, 0.53)
}
</style>