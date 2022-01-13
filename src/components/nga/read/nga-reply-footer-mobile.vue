<template>
  <div v-if="clientMode==='移动端'">
    <div style="text-align: left">
      <my-tag-with-tooltip v-if="row.timestamp" disabled>{{ row.timestamp.post }}</my-tag-with-tooltip>
      <my-tag-with-tooltip v-if="row.timestamp && row.timestamp.edit" disabled>E:{{ row.timestamp.edit }}</my-tag-with-tooltip>
    </div>
    <div class="space-between">
      <span>
        <nga-score-tag :reply="row" />
      </span>
      <span>
        <my-router-link :to="{name:'发帖',params:{action:'quote'},query:{tid:thread.tid,pid:row.pid}}" style="margin-right: 30px">
          <my-tag-with-tooltip disabled text="引用" />
        </my-router-link>
        <my-router-link :to="{name:'发帖',params:{action:'reply'},query:{tid:thread.tid,pid:row.pid}}" style="margin-right: 30px">
          <my-tag-with-tooltip disabled text="回复" />
        </my-router-link>
        <nga-read-operation-button :fid="thread.fid" :reply="row" style="margin-left: 10px" />
      </span>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import NgaScoreTag from "@/components/nga/read/nga-score-tag";
import MyTagWithTooltip from "@/components/my/my-tag-with-tooltip";
import MyRouterLink from "@/components/my/my-router-link";
import NgaReadOperationButton from "@/components/nga/read/nga-read-operation-button";

export default {
  name: "nga-reply-footer-mobile",
  data() {
    return {}
  },
  components: {NgaReadOperationButton, MyRouterLink, MyTagWithTooltip, NgaScoreTag},
  computed: {
    ...mapState('client', [`clientMode`]),
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    row: {},
    thread: {},
  },
}

</script>

<style scoped>
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>