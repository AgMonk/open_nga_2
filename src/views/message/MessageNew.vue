<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>
      <el-form label-width="80px">
        <el-form-item label="收件人">
          <el-select
              v-model="params.uidArray"
              default-first-option
              filterable
              multiple
              placeholder="选择目标用户"
              style="width:100%"
          >
            <el-option
                v-for="item in getUserArray()"
                :key="item.uid"
                :label="item.username"
                :value="item.uid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="params.subject" placeholder="标题" />
        </el-form-item>
        <el-form-item label="正文">
          <el-input id="nga-post-textarea"
                    v-model="params.content"
                    :rows="!params.content?5:Math.max(params.content.split(`\n`).length+1,5)" placeholder="正文"
                    style="margin-bottom: 5px"
                    type="textarea"
                    @keyup.enter.ctrl="create"
          />
        </el-form-item>
      </el-form>


      <el-button style="margin-top: 20px" type="success" @click="create">回复(Ctrl+Enter)</el-button>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapGetters} from "vuex";
import {createMessage} from "@/assets/request/message-request";
import {ElMessage} from "element-plus";

export default {
  name: "MessageNew",
  data() {
    return {
      params: {
        content: "",
        subject: "",
        uidArray: [],
      }
    }
  },
  computed: {},
  methods: {
    ...mapGetters('users', [`getUserArray`]),
    focus() {
      document.getElementById('nga-post-textarea').focus()
    },
    create() {
      createMessage(this.params).then(res => {
        ElMessage.success(res['0'])
        this.$router.push({name: '短消息列表', params: {page: 1}})
      })
    },
  },
  mounted() {
    const {to} = this.$route.query
    if (to) {
      this.params.uidArray = to.split(',').map(i => parseInt(i))
    }
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>