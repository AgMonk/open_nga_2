<template>
  <my-router-link v-if="type.startsWith('nga')" :to="ngaRoute">
    <span v-if="!$slots.default">{{ text }}</span>
    <slot/>
  </my-router-link>
  <el-link v-else :href="src" target="_blank">
    <span v-if="!$slots.default">{{ text }}</span>
    <slot/>
  </el-link>
</template>

<script>
import NgaThreadLink from "@/components/nga/thread/nga-thread-link";
import MyRouterLink from "@/components/my/my-router-link";
import {unEscape} from "@/assets/utils/StringUtils";

export default {
  name: "nga-content-link",
  components: {MyRouterLink, NgaThreadLink},
  data() {
    return {
      ngaThreadRegExp1: /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|ngabbs\.com)\/(.+?)\.php\?(.+)/,
      ngaThreadRegExp2: /^\/(.+?)\.php\?(.+)/,
      type: "",
      text: "",
      ngaRoute: {},
    }
  },
  methods: {
    //设置nga链接路由
    setNgaRoute(method, qs) {
      const o = {}
      const [query, hash] = qs.split("#")
      query.split("&").map(i => i.split("=")).forEach(i => o[i[0]] = i[1])
      if (method === 'thread') {
        const {fid, stid, authorid, page = 1} = o
        const {orderByPostDateDesc, recommend, searchpost} = o
        if (authorid) {
          this.text = `[用户:${authorid}的发言]`;
          this.ngaRoute = {
            name: "搜索用户发言",
            params: {
              authorid, page
            },
            query: {fid, searchpost, recommend}
          }
        } else if (stid) {
          this.text = `[合集：${stid}]`;
          this.ngaRoute = {
            name: "浏览合集主题",
            params: {
              stid, page
            },
            query: {orderByPostDateDesc}
          }
        } else {
          this.text = `[版面：${fid}]`;
          this.ngaRoute = {
            name: "浏览版面主题",
            params: {
              fid, page
            },
            query: {orderByPostDateDesc, recommend}
          }
        }
      }


      if (method === 'read') {
        const {tid, pid, authorid, page = 1} = o
        if (pid) {
          this.text = `[用户的发言 pid = ${pid}]`;
          this.ngaRoute = {
            name: "单个回复",
            params: {pid},
          }
        } else if (tid) {
          this.text = `[主题的回复列表 tid = ${tid} 第 ${page} 页]`;
          this.ngaRoute = {
            name: "回复列表",
            params: {tid, page, authorid},
          }
          if (hash) {
            const p = /pid(\d+)Anchor/
            const match = p.exec(hash)
            if (match) {
              this.ngaRoute.hash = `#P${match[1]}`
            }
          }
        }
      }
    },
    parse(src) {
      src = unEscape(src)
      const n1 = this.ngaThreadRegExp1.exec(src)
      const n2 = this.ngaThreadRegExp2.exec(src)
      const ngaMatch = n1 || n2;
      // console.log(ngaMatch)
      if (ngaMatch && ["read", "thread"].includes(ngaMatch[ngaMatch.length - 2])) {
        //是nga链接 且为主题列表或回复列表
        this.type = 'nga'
        const method = ngaMatch[ngaMatch.length - 2]
        const query = ngaMatch[ngaMatch.length - 1]
        this.setNgaRoute(method, query)
      } else {

        this.type = '外链'
        this.text = '[外部链接]'
      }
    },
  },
  mounted() {
    this.parse(this.src)
  },
  watch: {
    src(e) {
      this.parse(e)
    }
  },
  props: {
    //链接
    src: {type: String, required: true},

    createText: {type: Boolean, default: false},
  },
}

</script>

<style scoped>

</style>