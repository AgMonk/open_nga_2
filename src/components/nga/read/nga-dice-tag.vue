<template>
  <div>
    <el-tooltip :content="content" effect="light">
      <el-tag effect="dark" type="warning">{{ text }}</el-tag>
    </el-tooltip>
  </div>
</template>

<script>
import {rnd} from "@/assets/nga/nga-dice";

export default {
  name: "nga-dice-tag",
  data() {
    return {
      text: "",
      content: "",
    }
  },
  computed: {},
  methods: {
    update(data) {
      let tempSeed = this.seed.seed;
      const group = data.split('+')
      const pattern = /(\d*)d(\d+)/
      const results = []
      let sum = 0;
      group.forEach(item => {
        const match = pattern.exec(item)
        if (match) {
          const count = parseInt(match[1] ? match[1] : 1);
          const range = parseInt(match[2])
          for (let i = 0; i < count; i++) {
            const {seed, result} = rnd(tempSeed)
            const r = Math.floor(result * range + 1)
            sum += r;
            tempSeed = seed;
            results.push({range, result: r})
          }
        } else if (!isNaN(item)) {
          const n = parseInt(item)
          sum += n;
        }
      })
      this.seed.seed = tempSeed
      this.content = results.map(i => `d${i.range}(${i.result})`).join('+') + ' = ' + sum
      this.text = `Roll:${data} 结果：${sum}`;
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