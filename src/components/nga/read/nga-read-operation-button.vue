<!--回复楼层的操作按钮-->
<template>
  <el-tooltip effect="light" placement="bottom" style="margin-left: 5px">
    <template #content>
      <div>
        <h4>查看</h4>
        <my-tag-with-tooltip :route="{name:'回复列表',params:{page:1,tid:reply.tid},query:{authorid:reply.authorid}}" disabled text="只看TA"/>
        <my-tag-with-tooltip v-if="fid || reply.fid" :route="{name:'搜索用户发言',params:{page:1,authorid:reply.authorid},query:{fid:fid || reply.fid}}" disabled text="本版主题"/>
        <my-tag-with-tooltip v-if="fid || reply.fid"
                             :route="{name:'搜索用户发言',params:{page:1,authorid:reply.authorid},query:{fid:fid || reply.fid,searchpost:1}}"
                             disabled
                             text="本版回复"/>
        <my-tag-with-tooltip :route="{name:'搜索用户发言',params:{page:1,authorid:reply.authorid}}" disabled text="用户主题"/>
        <my-tag-with-tooltip :route="{name:'搜索用户发言',params:{page:1,authorid:reply.authorid},query:{searchpost:1}}" disabled text="用户回复"/>
      </div>
      <div>
        <h4>操作</h4>
        <my-router-link :to="{name:'发帖',params:{action:'quote'},query:{tid:reply.tid,pid:reply.pid}}">
          <my-tag-with-tooltip disabled text="引用"/>
        </my-router-link>
        <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:reply.tid,pid:reply.pid}}">
          <my-tag-with-tooltip disabled text="回复"/>
        </my-router-link>
        <my-router-link :to="{name:'发帖',params:{action:'modify'},query:{tid:reply.tid,pid:reply.pid}}">
          <my-tag-with-tooltip disabled text="编辑"/>
        </my-router-link>
        <!--suppress JSCheckFunctionSignatures -->
        <span @click="report(reply)"><my-tag-with-tooltip disabled text="举报"/></span>
        `
      </div>
    </template>
    <el-button class="齿轮图标" type="text">
      <el-icon>
        <setting/>
      </el-icon>
    </el-button>
  </el-tooltip>
</template>

<script>
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";
import {Setting} from '@element-plus/icons'
import MyRouterLink from "@/components/my/my-router-link";
import {ElMessage, ElMessageBox} from "element-plus";
import {report} from "@/assets/request/nuke-request";

export default {
  name: "nga-read-operation-button",
  components: {MyRouterLink, MyTagWithTooltip, Setting},
  data() {
    return {}
  },
  methods: {
    report({tid, pid}) {
      ElMessageBox.prompt('请填写理由', '举报理由', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }).then(({value}) => {
        report({tid, pid, info: value}).then(res => {
          ElMessage.success(res.data["0"])
        })
      }).catch(reason => {
        ElMessage.info("已取消")
        console.log(reason)
      })
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    reply: {
      type: Object,
      required: true,
    },
    fid: {
      type: Number,
    }
  },
}

</script>

<style scoped>

</style>