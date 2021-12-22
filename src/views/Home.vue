<template>
  <div class="home">
    <el-input v-model="cookie"  />
    <el-button  @click="setCookie">设置cookie</el-button>


    <div>
      <el-input v-model="tid"/>
      <el-input v-model="page"/>
      <el-button @click="test">测试</el-button>
    </div>


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
      fid:-547859,
      tid:25968165,
      // tid:26639977,
      page:5,
    }
  },
  methods:{
    setCookie(){
      setCookies(this.cookie,90,'/nga-api')
    },
    test(){
      console.clear()
      requestUnity({
        url:"read.php",
        data:{
          tid:this.tid,
          page:this.page,
        }
      }).then(res=>{
        console.log(res)
      })
    }
  }
}
</script>
