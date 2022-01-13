<template>
  <span v-if="reputation">
    <el-tag v-if="reputation.value<0" size="small" type="danger">{{ reputation.name }}({{ reputation.value }})</el-tag>
    <el-tag v-else-if="reputation.value<300" size="small" type="warning">{{ reputation.name }}({{ reputation.value }})</el-tag>
    <el-tag v-else-if="reputation.value<600" size="small">{{ reputation.name }}({{ reputation.value }})</el-tag>
    <el-tag v-else size="small" type="success">{{ reputation.name }}({{ reputation.value }})</el-tag>
  </span>
</template>

<script>
export default {
  name: "nga-user-reputation-tag",
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    reputation: {},
  },
}

</script>

<style scoped>

</style>