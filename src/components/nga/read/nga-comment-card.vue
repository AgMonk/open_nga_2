<template>
  <el-card class="box-card" style="height:100%">
    <template #header>
      <div class="card-header">
        <span>
          <nga-user-link :uid="reply.authorid"/>
          <nga-score-tag :reply="reply"/>
          <my-tag-with-tooltip v-if="reply.timestamp" disabled>{{ reply.timestamp.post }}</my-tag-with-tooltip>
          <my-tag-with-tooltip v-if="reply.timestamp && reply.timestamp.edit" disabled>最后编辑:{{ reply.timestamp.edit }}</my-tag-with-tooltip>
        </span>
        <span>
           <my-router-link :to="{name:'发帖',params:{action:'quote'},query:{tid:reply.tid,pid:reply.pid}}">
 <my-tag-with-tooltip disabled text="引用"/>
</my-router-link>
<my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:reply.tid,pid:reply.pid}}">
  <my-tag-with-tooltip disabled text="回复"/>
</my-router-link>
<nga-read-operation-button :reply="reply"/>
 </span>
      </div>
    </template>
    <div>
      <nga-content :content="reply.content"/>
    </div>
  </el-card>
</template>

<script>
import NgaReadUserCard from "@/components/nga/read/nga-read-user-card";
import NgaScoreTag from "@/components/nga/read/nga-score-tag";
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";
import NgaUserLink from "@/components/nga/user/nga-user-link";
import MyRouterLink from "@/components/my/my-router-link";
import NgaReadOperationButton from "@/components/nga/read/nga-read-operation-button";
import NgaContent from "@/components/nga/read/nga-content";

export default {
  name: "nga-comment-card",
  components: {NgaContent, NgaReadOperationButton, MyRouterLink, NgaUserLink, MyTagWithTooltip, NgaScoreTag, NgaReadUserCard},
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    reply: {type: Object, required: true}
  },
}

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
}
</style>