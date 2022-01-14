<template>
  <el-card class="box-card" style="height:100%">
    <template #header>
      <div v-if="clientMode==='PC端'" class="card-header">
        <span>
          <nga-user-link :uid="reply.authorid" />
          <nga-level-tag :reply="reply" />
          <nga-score-tag :reply="reply" />
          <my-tag-with-tooltip v-if="reply.timestamp" disabled>{{ reply.timestamp.post }}</my-tag-with-tooltip>
          <my-tag-with-tooltip v-if="reply.timestamp && reply.timestamp.edit" disabled>最后编辑:{{ reply.timestamp.edit }}</my-tag-with-tooltip>
        </span>
        <span>
          <my-router-link :to="{name:'发帖',params:{action:'quote'},query:{tid:reply.tid,pid:reply.pid}}">
            <my-tag-with-tooltip disabled text="引用" />
          </my-router-link>
          <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:reply.tid,pid:reply.pid}}">
            <my-tag-with-tooltip disabled text="回复" />
          </my-router-link>
          <nga-read-operation-button :reply="reply" />
        </span>
      </div>

      <div v-if="clientMode==='移动端'">
        <nga-read-user-card-mobile :uid="reply.authorid" />
      </div>
    </template>
    <div :style="contentStyle">
      <nga-content :content="reply.content" />
      <nga-reply-footer-mobile v-if="reply.authorid && !(''+reply.authorid).includes('未知用户')"
                               :row="reply"
                               :thread="thread"
      />

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
import NgaContent from "@/components/nga/content/nga-content";
import NgaReplyFooterMobile from "@/components/nga/read/nga-reply-footer-mobile";
import {mapState} from "vuex";
import NgaReadUserCardMobile from "@/components/nga/read/nga-read-user-card-mobile";
import NgaLevelTag from "@/components/nga/read/nga-level-tag";

export default {
  name: "nga-comment-card",
  components: {
    NgaLevelTag,
    NgaReadUserCardMobile,
    NgaReplyFooterMobile,
    NgaContent,
    NgaReadOperationButton,
    MyRouterLink,
    NgaUserLink,
    MyTagWithTooltip,
    NgaScoreTag,
    NgaReadUserCard
  },
  computed: {
    ...mapState('client', [`clientMode`]),
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    reply: {type: Object, required: true},
    thread: {type: Object, required: true},
    contentStyle: {type: Object},
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