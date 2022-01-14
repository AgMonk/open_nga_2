<template>
  <el-tag effect="dark" type="warning">{{ text }}</el-tag>

</template>

<script>
export default {
  name: "nga-dice-tag",
  data() {
    return {
      text: "",
    }
  },
  computed: {},
  methods: {
    update(data) {
      console.log(this.seed)

      this.text = data;
    }
  },
  mounted() {
    this.update(this.data)
  },
  watch: {
    data(to) {
      this.update(to)
    },
  },
  props: {
    seed: {type: Object, required: true},
    data: {type: String, required: true},
  },
}

</script>

<style scoped>

</style>