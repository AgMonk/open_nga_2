<template>
  <div v-if="forum && forum.children && forum.children.length>0">
    <el-collapse id="subForums">
      <el-collapse-item title="子版面/合集">
        <!--todo 关注 取关-->
        <!--        <nga-forum-avatar v-for="forum in forum.children" :forum="forum" />-->
        <el-descriptions>
          <el-descriptions-item v-for="item in forum.children">
            <template #label>
              <el-avatar :size="50" :src="item.avatar?item.avatar:defaultSrc"
                         shape="square"
                         style="--el-avatar-bg-color:none;margin-top: 0"
                         @error="errorHandler(item)"
              />
            </template>
            <my-router-link :to='item.fid?{name: "浏览版面主题", params: {page: 1, fid:item.fid}}: {name: "浏览合集主题", params: {page: 1, stid:item.stid}}'>
              {{ item.name }}
            </my-router-link>
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

import NgaForumAvatar from "@/components/nga/forum/nga-forum-avatar";
import NgaSubForumAvatar from "@/components/nga/thread/nga-sub-forum-avatar";
import MyRouterLink from "@/components/my/my-router-link";

export default {
  name: "nga-sub-forum-area",
  components: {MyRouterLink, NgaSubForumAvatar, NgaForumAvatar},
  data() {
    return {
      defaultSrc: require('@/assets/icon/00.png'),
    }
  },
  computed: {},
  methods: {
    errorHandler(item, e) {
      console.log(item)
      item.avatar = this.defaultSrc
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    forum: {type: Object},
  },
}

</script>

<style scoped>

</style>