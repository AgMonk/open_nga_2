<template>
  <my-router-link v-if="type.startsWith('nga')" :to="ngaRoute">
    <span v-if="!$slots.defalut">{{ text }}</span>
    <slot/>
  </my-router-link>
  <el-link v-else :href="src" target="_blank">
    <span v-if="!$slots.defalut">{{ text }}</span>
    <slot/>
  </el-link>
</template>

<script>
import NgaThreadLink from "@/components/nga/thread/nga-thread-link";
import MyRouterLink from "@/components/my/my-router-link";

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
      if (method === 'read') {

      }
      if (method === 'thread') {

      }


      console.log(o)

    },
    parse(src) {
      const n1 = this.ngaThreadRegExp1.exec(src)
      const n2 = this.ngaThreadRegExp2.exec(src)
      const ngaMatch = n1 || n2;
      console.log(ngaMatch)
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
    src: {type: String, required: true},
    createText: {type: Boolean, default: false},
  },
}

</script>

<style scoped>

</style>