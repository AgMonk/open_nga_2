<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <div id="搜索条件" style="text-align: left">
        <el-form inline>
          <el-form-item label="搜索">
            <el-switch v-model="mode" active-text="版面" active-value="版面" inactive-text="合集" inactive-value="合集" />
          </el-form-item>
          <el-form-item v-if="mode==='版面'" label="版面">
            <el-select v-model="params.fid" :size="size" multiple value-key="fid">
              <el-option v-for="item in forums" :label="item.name" :value="item.fid" />
              <el-option v-for="item in favorForums" :label="item.name" :value="item.fid" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="mode==='合集'" label="合集">
            <el-select v-model="params.stid" :size="size" multiple>
              <el-option v-for="item in sets" :label="item.name" :value="item.stid" />
              <el-option v-for="item in favorSets" :label="item.name" :value="item.stid" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="mode==='版面'" label="精华">
            <el-checkbox v-model="params.recommend" :size="size" />
          </el-form-item>
          <el-form-item label="包括主楼正文">
            <el-checkbox v-model="params.content" :size="size" />
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="params.key" :size="size" placeholder="搜索关键字" style="width:200px" @keyup.enter="search" />
          </el-form-item>
          <el-form-item>
            <el-button :size="size" type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>


      </div>

      <router-view />
    </el-main>
  </el-container>

</template>

<script>
import NgaBreadcrumb from "@/components/nga/nga-breadcrumb";
import {mapActions, mapState} from "vuex";

export default {
  name: "Search",
  components: {NgaBreadcrumb},
  computed: {
    ...mapState('history', [`forums`, `sets`]),
  },
  data() {
    return {
      size: 'small',
      mode: '版面',
      favorForums: [],
      favorSets: [],
      params: {
        fid: [],
        stid: [],
        key: "",
        recommend: false,
        content: false,
      }
    }
  },
  methods: {
    ...mapActions('forums', [`getFavorForums`]),
    search() {
      const {fid, stid, key, recommend, content} = this.params
      const query = {content: content ? 1 : undefined}
      const page = 1
      if (this.mode === '版面') {
        query.recommend = recommend ? 1 : undefined;
        this.$router.push({name: "搜索版面主题", params: {key, fid: fid.join(','), page}, query})
      }
      if (this.mode === '合集') {
        this.$router.push({name: "搜索合集主题", params: {key, stid: stid.join(','), page}, query})
      }
    },
    async update(route) {
      const res = await this.getFavorForums()
      this.favorForums = res.filter(i => !i.stid).filter(i => !this.forums.map(j => parseInt(j.fid)).includes(i.fid))
      this.favorSets = res.filter(i => i.stid).filter(i => !this.sets.map(j => parseInt(j.stid)).includes(i.stid))

      const {params, query} = route;
      const {fid, stid, key} = params
      const {recommend, content} = query;

      this.params = {key}
      if (fid) {
        this.params.fid = fid.split(',').map(i => parseInt(i))
      }
      if (stid) {
        this.params.stid = stid.split(',').map(i => parseInt(i))
      }
      this.params.recommend = recommend === '1'
      this.params.content = content === '1'
    }
  },
  async mounted() {
    await this.update(this.$route)
  },
  watch: {
    $route(to) {
      this.update(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>