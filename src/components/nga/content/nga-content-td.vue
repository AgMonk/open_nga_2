<template>
  <td :style="style">
    <slot />
  </td>
</template>

<script>
export default {
  name: "nga-content-td",
  data() {
    return {
      style: {
        border: "1px solid black",
        "word-wrap": "break-word",
        "word-break": "break-all",
        "text-align": "left",
      }
    }
  },
  computed: {},
  methods: {},
  mounted() {
    console.log(this.props)
    const widthPattern = /width(\d+)/
    const widthMatch = widthPattern.exec(this.props)
    if (widthMatch) {
      this.style.width = `${widthMatch['1']}%`
    }
  },
  watch: {},
  props: {
    props: {}
  },
}

</script>

<style scoped>
</style>