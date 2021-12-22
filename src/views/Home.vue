<template>
  <div class="home">
    <el-input v-model="cookie"  />
    <el-button  @click="setCookie">设置cookie</el-button>


    <div>
      <el-form>
        <el-form-item label="主题列表"><el-input v-model="fid"/><el-button @click="thread"  type="primary">发送</el-button></el-form-item>
        <el-form-item label="主题详情"><el-input  v-model="tid"/><el-button @click="read" type="primary">发送</el-button></el-form-item>
        <el-form-item label="页码"><el-input v-model="page"/></el-form-item>
      </el-form>

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
      page:1,
    }
  },
  methods:{
    setCookie(){
      setCookies(this.cookie,90,'/nga-api')
    },
    thread(){
      console.clear()
      requestUnity({
        url:"thread.php",
        data:{
          fid:this.fid,
          page:this.page,
        }
      }).then(res=>{
        console.log(res)
      })
    },
    read(){
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
    },

  }
}
</script>
