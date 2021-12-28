<template>
<span>
   {{ money.gold }}
          <span style="color:yellow;font-weight: bold">金</span>
          {{ money.silver }}
          <span style="color:blue;font-weight: bold">银</span>
          {{ money.copper }}
          <span style="color:coral;font-weight: bold">铜</span>
</span>
</template>

<script>
export default {
  name: "nga-money-text",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    money: {type: Object, required: true}
  },
}

</script>

<style scoped>

</style>