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
  }
}
</script>
