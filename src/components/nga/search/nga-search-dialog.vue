<template>
  <span>
    <el-button size="small" style="margin-right: 10px" type="primary" @click="show=true">搜索</el-button>
    <el-dialog v-model="show" title="搜索条件">
      <nga-search-form :data="data" :mode="mode" append-to-body />
    </el-dialog>
  </span>
</template>

<script>
import NgaSearchForm from "@/components/nga/search/nga-search-form";

export default {
  name: "nga-search-dialog",
  components: {NgaSearchForm},
  data() {
    return {
      show: false,
    }
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    data: {type: Object},
    mode: {type: String, default: '版面'},
  },
}

</script>

<style scoped>

</style>