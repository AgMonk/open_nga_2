<template>
  <el-row >
    <el-col :span="isType(data.mirror,[ '合集主题', '子版主题'])?20:24">
      <nga-thread-link :data="data" />
      <nga-thread-type-tag :type="data.type" />
      <el-pagination
          v-if="data.replies>19 && $route.name!=='已收藏主题'"
          :total="data.replies+1"
          :page-size="20"
          :pager-count="5"
          :default-current-page="0"
          style="display:inline-block"
          small
          layout="pager"
          @current-change="$router.push({name:'回复列表',params:{page:$event,tid:data.tid}})"
      />
      <div v-if="data.reply">
        <my-router-link :to="{name:'单个回复',params:{pid:data.reply.pid}}">[主题内的回复]</my-router-link>
        <my-timestamp :time="data.reply.timestamp.post.time"/>
        <br>
        <el-collapse>
          <el-collapse-item title="回复内容(点击展开)">
            <nga-content :content="data.reply.content"/>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-col>
    <el-col v-if="isType(data.mirror,[ '合集主题', '子版主题'])" :span="4" style="text-align: right">
      <my-router-link v-if="isType(data.mirror,'合集主题')" :to="`/thread/s/${data.mirror.stid}/1`">
        [{{data.mirror.collection}}]
      </my-router-link>
    <my-router-link v-if="isType(data.mirror,'子版主题')" :to="`/thread/f/${data.mirror.fid}/1`">
        [{{data.mirror.forum}}]
      </my-router-link>
    </el-col>
  </el-row>
</template>

<script>
import MyRouterLink from "@/components/my/my-router-link";
import NgaThreadLink from "@/components/nga/thread/nga-thread-link";
import NgaThreadTypeTag from "@/components/nga/thread/nga-thread-type-tag";
import MyTimestamp from "@/components/my/my-timestamp";
import NgaContent from "@/components/nga/read/nga-content";

export default {
  name: "thread-row",
  components: {NgaContent, MyTimestamp, NgaThreadTypeTag, NgaThreadLink, MyRouterLink},
  data() {
    return {}
  },
  methods: {
    //判断是否为子主题
    isType(mirror,type) {
      return mirror && mirror.type && (mirror.type===type || type.includes(mirror.type));
    },
    // getRoutePath(type,id){
    //   switch (type) {
    //     case "合集":return `/thread/s/${id}/1`;
    //     case "版面":return `/thread/f/${id}/1`;
    //     case "合集主题":return `/thread/s/${id}/1`;
    //     case "子版主题":return `/thread/f/${id}/1`;
    //     default:return `/read/t/${id}/1`;
    //   }
    // }
  },
  mounted() {
  },
  watch: {},
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
}

</script>

<style scoped>
.el-pagination {
  --el-pagination-bg-color: rgb(0 0 0 / 0%);
  --el-pagination-button-disabled-bg-color: rgb(0 0 0 / 0%);
}

.el-pager li {
  background: rgb(0 0 0 / 0%);
}
</style>