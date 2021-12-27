<template>
  <el-tooltip placement="top" :content="tooltip" :placement="placement">
    <template #content>
      <slot name="tooltip"/>
    </template>
    <el-tag :type="type" :size="size" :effect="effect">
      {{text}}
      <slot/>
    </el-tag>
  </el-tooltip>
</template>

<script>
export default {
  name: "my-tag-with-tooltip",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    tooltip:{},
    placement:{},
    text:{},
    type:{},
    size:{},
    effect:{},
  },
}

</script>

<style scoped>

</style>