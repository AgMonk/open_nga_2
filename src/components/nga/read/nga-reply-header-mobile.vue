<template>
  <div v-if="clientMode==='移动端'" class="space-between">
    <span>
      <nga-level-tag :reply="row" />
    </span>
    <span>
      <nga-thread-type-tag :type="row.type" />
    </span>
  </div>
</template>

<script>
import {mapState} from "vuex";
import NgaLevelTag from "@/components/nga/read/nga-level-tag";
import NgaThreadTypeTag from "@/components/nga/thread/nga-thread-type-tag";

export default {
  name: "nga-reply-footer-mobile",
  data() {
    return {}
  },
  components: {NgaThreadTypeTag, NgaLevelTag},
  computed: {
    ...mapState('client', [`clientMode`]),
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    row: {},
  },
}

</script>

<style scoped>
</style>