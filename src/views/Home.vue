<template>
  <div class="home">
    <el-input v-model="cookie"  />
    <el-button  @click="setCookie">设置cookie</el-button>
    <el-button @click="test">测试</el-button>

  </div>
</template>

<script>
// @ is an alias to /src
import {setCookies} from "@/assets/utils/CookieUtils";
import {requestUnity} from "@/assets/request/nga-request";

export default {
  name: 'Home',
  components: {
  },
  data(){
    return {
      cookie:'',
    }
  },
  methods:{
    setCookie(){
      setCookies(this.cookie,90,'/nga-api')
    },
    test(){
      requestUnity({
        url:"thread.php",
        data:{
          fid:-547859,
        }
      }).then(res=>{
        console.log(res)
      })
    }
  }
}
</script>
