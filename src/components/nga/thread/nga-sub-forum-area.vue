<template>
  <div v-if="forum && forum.children && forum.children.length>0">
    <el-collapse id="subForums">
      <el-collapse-item title="子版面/合集">
        <!--        <nga-forum-avatar v-for="forum in forum.children" :forum="forum" />-->
        <el-descriptions :column="4">
          <el-descriptions-item v-for="(item,i) in forum.children" :style="getRowStyle()({rowIndex:i})">
            <template #label>
              <el-avatar :size="50" :src="item.avatar?item.avatar:defaultSrc"
                         shape="square"
                         style="--el-avatar-bg-color:none;margin-top: 0"
                         @error="errorHandler(item)"
              />
            </template>
            <span style="vertical-align: top">
              <my-router-link :to='item.fid?{name: "浏览版面主题", params: {page: 1, fid:item.fid}}: {name: "浏览合集主题", params: {page: 1, stid:item.stid}}'>
                <span :style="getHeaderRowStyle">{{ item.name }}</span>
                <br>
                <span v-if="item.dsc">({{ item.dsc }})</span>
              </my-router-link>
              <el-checkbox v-model="item.selection" style="margin-left: 15px" @change="blockChanged(item,$event)" />
              <!--todo 关注 取关-->
              <!--todo 描述-->
            </span>
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
import {mapGetters} from "vuex";
import {followStid, getBlockTid, unfollowStid} from "@/assets/request/forum-request";
import {ElMessage} from "element-plus";

export default {
  name: "nga-sub-forum-area",
  components: {MyRouterLink, NgaSubForumAvatar, NgaForumAvatar},
  data() {
    return {
      defaultSrc: require('@/assets/icon/00.png'),
    }
  },
  computed: {},
  emits: ['follow-changed'],
  methods: {
    ...mapGetters('config', [`getHeaderRowStyle`, `getRowStyle`]),
    blockChanged(item, e) {
      if (e) {
        //  关注
        followStid(item.stid, this.forum.fid).then(() => {
          ElMessage.success(`已关注`)
          this.$emit('follow-changed')
        }).catch(reason => {
          console.log(reason)
          item.selection = !e;
        })
      } else {
        //  取关
        unfollowStid(item.stid, this.forum.fid).then(() => {
          ElMessage.success(`已取消关注`)
          this.$emit('follow-changed')
        }).catch(reason => {
          console.log(reason)
          item.selection = !e;
        })
      }
    },
    errorHandler(item, e) {
      // console.log(item)
      item.avatar = this.defaultSrc
    },
    async update(forum) {
      const {unionFid, blockTid} = await getBlockTid(forum.fid)
      const children = forum.children
      children.forEach(item => item.selection = !blockTid.includes(item.stid))
      console.log(children)
    }
  },
  mounted() {
    this.update(this.forum)
  },
  watch: {
    forum(to) {
      this.update(to)
    }
  },
  props: {
    forum: {type: Object},
  },
}

</script>

<style scoped>
.el-collapse {
  --el-collapse-header-bg-color: rgb(0 0 0 / 0%);
  --el-collapse-content-bg-color: rgb(0 0 0 / 0%);
}

.el-descriptions__cell {
  background-color: rgb(0 0 0 / 0%);
}

.el-descriptions__body {
  background-color: rgb(0 0 0 / 0%);
}

</style>