<template>
  <span>
    <el-button :size="size" style="margin-right: 10px" type="primary" @click="showDialog">搜索</el-button>
    <el-dialog v-model="show" :width="clientMode==='PC端'?'50%':'90%'" title="搜索条件">
      <nga-search-form :data="data" :mode="mode" append-to-body />
    </el-dialog>
  </span>
</template>

<script>
import NgaSearchForm from "@/components/nga/search/nga-search-form";
import {mapState} from "vuex";

export default {
  name: "nga-search-dialog",
  components: {NgaSearchForm},
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState('client', [`clientMode`]),
  },
  methods: {
    showDialog() {
      this.show = true;
      this.$nextTick(() => {
        document.getElementById('search-input').focus()
      })
    }
  },
  mounted() {
  },
  watch: {},
  props: {
    data: {type: Object},
    mode: {type: String, default: '版面'},
    size: {default: 'small'},
  },
}

</script>

<style scoped>

</style>