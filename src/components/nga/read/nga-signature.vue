<template>
<span v-if="users[uid]">
  <nga-content :content="users[uid].signature"/>
</span>
</template>

<script>
import {mapState} from "vuex";
import NgaContent from "@/components/nga/content/nga-content";

export default {
  name: "nga-signature",
  components: {NgaContent},
  data() {
    return {}
  },
  computed: {
    ...mapState('users', ["users"])
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    uid: {required: true}
  },
}

</script>

<style scoped>

</style>