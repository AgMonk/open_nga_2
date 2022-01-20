<template>
  <div>
    <el-table :data="vote.options" border show-summary style="width: 100%" @selection-change="handleSelectionChange">
      <!--投票-->
      <el-table-column v-if="!vote.config.type && !vote.config.disabled" type="selection" width="40" />
      <!--菠菜 -->
      <el-table-column v-if="isGambling(vote.config) && !vote.config.disabled" prop="id" width="90">
        <template #default="s">
          <el-input v-model="s.row.betting" :size="size" class="no-number" type="number" @change="bettingChange" />
        </template>
      </el-table-column>
      <el-table-column label="选项" prop="text">
        <template #default="s">
          {{ s.row.text }}
          <el-tag v-if="s.row.win" :size="size" effect="dark" type="danger">胜出</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="vote.config.totalCount>0" label="投票" prop="count">
        <template #default="s">
          <b>{{ s.row.count }}</b>
          ({{ s.row.countPercent.toFixed(2) }}%)
        </template>
      </el-table-column>
      <el-table-column v-if="vote.config.totalMoney>0" label="铜币" prop="money">
        <template #default="s">
          <b>{{ s.row.money }}</b>
          ({{ s.row.moneyPercent.toFixed(2) }}%)
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!vote.config.disabled" style="text-align: left">
      <el-button :size="size" type="primary" @click="doVote">
        <span v-if="isGambling(vote.config)">投注</span>
        <span v-else>投票</span>
      </el-button>
    </div>
  </div>
</template>
<script>
import {vote} from "@/assets/request/nuke-request";

export default {
  name: 'nga-vote-table',
  data() {
    return {
      size: 'small',
      selection: [],
    }
  },
  props: {
    vote: {type: Object, required: true},
    tid: {type: Number, required: true},
  },
  mounted() {
  },
  methods: {
    //是否为菠菜
    isGambling(config) {
      return config && config.hasOwnProperty('type') && config.type === 1
    },
    doVote() {
      vote({tid: this.tid, voteid: this.selection.join(',')}).then(res => {
        console.log(res)
      })
    },
    bettingChange() {
      this.selection = this.vote.options.flatMap(item => {
        const {id, betting} = item
        if (betting && !isNaN(betting)) {
          return [id, parseInt(betting)]
        }
        return []
      })
    },
    handleSelectionChange(e) {
      this.selection = e.map(i => i.id)
    }
  }
}
</script>
<style scoped>
</style>