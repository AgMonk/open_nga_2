<template>
  <el-descriptions-item>
    <template #label>
      <el-avatar :size="50" :src="src"
                 shape="square"
                 style="--el-avatar-bg-color:none;margin-top: 0"
                 @error="errorHandler"
      />
    </template>
    <my-router-link :to="route">
      {{ name }}
    </my-router-link>
  </el-descriptions-item>
</template>

<script>
import MyRouterLink from "@/components/my/my-router-link";

export default {
  name: "nga-sub-forum-avatar",
  components: {MyRouterLink},
  data() {
    return {
      src: ``,
      route: {},
      defaultSrc: require('@/assets/icon/00.png'),
      name: "",
    }
  },
  computed: {},
  methods: {
    errorHandler(e) {
      this.src = this.defaultSrc
    },
    update(f) {
      const {fid, stid, name} = f;
      console.log(f)
      this.name = name.substring(0, Math.min(name.length, 10));
      if (fid) {
        this.src = `/icon/f/${fid}u.png`;
        this.route = {name: "浏览版面主题", params: {page: 1, fid}}
      } else {
        this.src = this.defaultSrc;
        this.route = {name: "浏览合集主题", params: {page: 1, stid}}
      }
    },
  },
  mounted() {
    this.update(this.forum)
  },
  watch: {
    forum(to) {
      this.update(to)
    },
  },
  props: {
    forum: {
      type: Object,
      required: true,
    }
  },
}

</script>

<style scoped>

</style>