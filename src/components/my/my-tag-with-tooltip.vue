<template>
  <el-tooltip placement="top" :content="tooltip" :placement="placement" :effect="effect" :disabled="disabled">
    <template #content>
      <slot name="tooltip"/>
    </template>
    <el-tag :type="type" :size="size"  style="padding:0 1px">
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
    type:{
      type:String,
    },
    size:{
      default:'small',
    },
    effect:{
      type:String,
      default:'light',
    },
    disabled:{
      type:Boolean
    }
  },
}

</script>

<style scoped>

</style>