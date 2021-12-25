<template>
  <router-link :to="to">
    <el-link :underline="false" :style="style">
      <slot/>
    </el-link>
  </router-link>
</template>

<script>
export default {
  name: "my-router-link",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    style: {
      type: Object,
    },
    to:{
      required: true,
    }
  },
}

</script>

<style scoped>
.router-link-active {
  text-decoration: none;

}

a {
  text-decoration: none;
}
</style>