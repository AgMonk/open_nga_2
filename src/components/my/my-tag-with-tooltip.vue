<template>
  <el-tooltip :content="tooltip" :disabled="disabled" :effect="effect" :placement="placement" placement="top" style="margin-left: 2px">
    <template #content>
      <slot name="tooltip"/>
    </template>
    <el-tag :size="size" :type="type" style="padding:0 1px;cursor: pointer" @click="click">
      {{ text }}
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
  methods: {
    click() {
      if (this.route) {
        this.$router.push(this.route)
      }
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    route: {},
    tooltip: {},
    placement: {},
    text: {},
    type: {
      type: String,
    },
    size: {
      default: 'small',
    },
    effect: {
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