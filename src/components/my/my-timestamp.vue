<template>
  <span :class="clazz">{{ text }}</span>
</template>

<script>
import {second2String} from "@/assets/utils/DateFormat";

export default {
  name: "my-timestamp",
  data() {
    return {
      text: "",
      clazz: "b1",
    }
  },
  methods: {
    update(e){
      const range = Math.floor(new Date().getTime() / 1000) - e;
      if (range < 60) {
        this.text = `${range}秒前`
      } else if (range < 60 * 60) {
        this.text = `${Math.floor(range / 6) / 10}分钟前`
      } else if (range < 60 * 60 * 24) {
        this.text = `${Math.floor(range / 6 / 60) / 10}小时前`
        this.clazz = 'b2'
      } else if (range < 60 * 60 * 24 * 7) {
        this.text = `${Math.floor(range / 6 / 60 / 24) / 10}天前`
        this.clazz = 'b3'
      } else {
        this.text = second2String(e)
        this.clazz = 'b4';
      }
    },
  },
  mounted() {
    this.update(this.time)
  },
  watch: {
    time(to){
      this.update(to)
    }
  },
  props: {
    time: {
      type: Number,
      required: true,
    }
  },
}

</script>

<style scoped>
.b1 {
  background-color: #98d75e;
}

.b2 {
  background-color: #f5e393;
}

.b3 {
  background-color: #f5ab25;
}

.b4 {
  background-color: #fc86ef;
}

</style>