<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
        <el-button class="button" type="text">Operation button</el-button>
      </div>
    </template>
    {{uid}}
  </el-card>
</template>

<script>
export default {
  name: "nga-read-user-card",
  data() {
    return {}
  },
  computed: {
  },
  methods: {
    update(e){

    },
  },
  mounted() {
  },
  watch: {},
  props: {
    uid:{
      required: true,
    }
  },
}

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-card{
  --el-card-padding:10px;
}
</style>