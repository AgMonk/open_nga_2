<template>
  <div v-if="clientMode==='PC端'" class="space-between">
    <!--赞踩按钮-->
    <span>
      <nga-level-tag :reply="row" />
      <nga-score-tag :reply="row" />
      <my-tag-with-tooltip v-if="row.timestamp" disabled>{{ row.timestamp.post }}</my-tag-with-tooltip>
      <my-tag-with-tooltip v-if="row.timestamp && row.timestamp.edit" disabled>最后编辑:{{ row.timestamp.edit }}</my-tag-with-tooltip>
      <my-tag-with-tooltip v-if="row.reply_to" :route="{name:'单个回复',params:{pid:row.reply_to}}" disabled type="warning">回复目标</my-tag-with-tooltip>
      <nga-thread-type-tag :type="row.type" />
      <my-tag-with-tooltip v-if="$route.hash===`#P${row.pid}` || $route.hash===`#L${row.level}`"
                           size="small"
                           tooltip="跳转链接指向的回复"
                           type="danger"
      ><b>这个回复</b></my-tag-with-tooltip>
    </span>

    <span>
      <my-router-link :to="{name:'发帖',params:{action:'quote'},query:{tid:thread.tid,pid:row.pid}}">
        <my-tag-with-tooltip disabled text="引用" />
      </my-router-link>
      <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:thread.tid,pid:row.pid}}">
        <my-tag-with-tooltip disabled text="回复" />
      </my-router-link>
      <nga-read-operation-button :fid="thread.fid" :reply="row" style="margin-left: 10px" />
    </span>
  </div>

</template>

<script>
import NgaReadOperationButton from "@/components/nga/read/nga-read-operation-button";
import NgaCommentCard from "@/components/nga/read/nga-comment-card";
import NgaThreadTypeTag from "@/components/nga/thread/nga-thread-type-tag";
import MyRouterLink from "@/components/my/my-router-link";
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";
import NgaLevelTag from "@/components/nga/read/nga-level-tag";
import NgaScoreTag from "@/components/nga/read/nga-score-tag";
import {mapState} from "vuex";

export default {
  name: "nga-reply-header-pc",
  components: {
    NgaReadOperationButton,
    NgaCommentCard,
    NgaThreadTypeTag,
    MyRouterLink,
    MyTagWithTooltip,
    NgaLevelTag,
    NgaScoreTag,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('client', [`clientMode`]),
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    row: {type: Object, required: true},
    thread: {type: Object, required: true},
  },
}

</script>

<style scoped>
</style>