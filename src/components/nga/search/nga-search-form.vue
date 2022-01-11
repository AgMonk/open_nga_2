<template>
  <el-form :model="params" inline>
    <el-form-item label="搜索">
      <el-switch v-model="m" active-text="版面" active-value="版面" inactive-text="合集" inactive-value="合集" />
    </el-form-item>
    <el-form-item v-if="m==='版面'" label="版面">
      <el-select v-model="params.fid" :size="size" filterable multiple value-key="fid">
        <el-option v-for="item in forums" :label="item.name" :value="item.fid" />
        <el-option v-for="item in favorForums" :label="item.name" :value="item.fid" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="m==='合集'" label="合集">
      <el-select v-model="params.stid" :size="size" multiple>
        <el-option v-for="item in sets" :label="item.name" :value="item.stid" />
        <el-option v-for="item in favorSets" :label="item.name" :value="item.stid" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="m==='版面'" label="精华">
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

</template>

<script>
import {mapActions, mapState} from "vuex";
import {copyObj} from "@/assets/utils/ObjectUtils";
import {ElMessage} from "element-plus";

export default {
  name: "nga-search-form",
  data() {
    return {
      size: 'small',
      m: '版面',
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
  computed: {
    ...mapState('history', [`forums`, `sets`]),
  },
  methods: {
    ...mapActions('forums', [`getFavorForums`]),
    search() {
      const {fid, stid, key, recommend, content} = this.params
      const query = {content: content ? 1 : undefined}
      const page = 1
      if (!key) {
        ElMessage.error('关键字不能为空')
        return;
      }

      if (this.m === '版面') {
        query.recommend = recommend ? 1 : undefined;
        if (!fid || fid.length === 0) {
          ElMessage.error('必须选择至少一个版面')
          return;
        }
        this.$router.push({name: "搜索版面主题", params: {key, fid: fid.join(','), page}, query})
      }
      if (this.m === '合集') {
        if (!stid || stid.length === 0) {
          ElMessage.error('必须选择至少一个合集')
          return;
        }
        this.$router.push({name: "搜索合集主题", params: {key, stid: stid.join(','), page}, query})
      }
    },
    async update(data) {
      const res = await this.getFavorForums()
      this.favorForums = res.filter(i => !i.stid).filter(i => !this.forums.map(j => parseInt(j.fid)).includes(i.fid))
      this.favorSets = res.filter(i => i.stid).filter(i => !this.sets.map(j => parseInt(j.stid)).includes(i.stid))

      this.params = copyObj(data)
      this.m = this.mode

    }
  },
  mounted() {
    this.update(this.data)
    this.m = this.mode
  },
  watch: {
    data(to) {
      this.update(to)
    },
    mode(to) {
      this.m = this.mode
    },
  },
  props: {
    data: {type: Object},
    mode: {type: String, default: '版面'},
  },
}

</script>

<style scoped>

</style>