<template>
  <el-carousel height="150px" trigger="click">
    <el-carousel-item v-for="(item,i) in data" :key="i">
      <nga-content-render :data="item.children" />
    </el-carousel-item>
  </el-carousel>

</template>

<script>
import NgaContentRender from "@/components/nga/content/nga-content-render";

export default {
  name: "nga-content-carousel",
  components: {NgaContentRender},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    data: {type: Object, required: true}
  },
}

</script>

<style scoped>

</style>