<template>
  <div class="home">
    <el-input v-model="cookie"/>
    <el-button @click="setCookie">设置cookie</el-button>


    <div>

    </div>


  </div>
</template>

<script>
// @ is an alias to /src
import {setCookies} from "@/assets/utils/CookieUtils";
import {nukeRequest} from "@/assets/request/nga-request";

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      cookie: '',
      fid: -547859,
      tid: 25968165,
      page: 1,
    }
  },
  methods: {
    setCookie() {
      setCookies(this.cookie, 90, '/nga-api')
    },

  },
  async mounted() {
    //收藏版面
    const r1 = await nukeRequest({
      __lib: "forum_favor2",
      __act: "forum_favor",
      action: "get",
    })
    // console.log(r1)
    //提醒消息
    const r2 = await nukeRequest({
      __lib:'noti',
      raw:3,
      __act:"get_all",
      time_limit:1,
    })
    // console.log(r2)
  //  用户信息
    const r3 = await nukeRequest({
      __lib:"ucp",
      __act:"get",
      uid:38541735,
    })
    // console.log(r3)
  }
}
</script>
