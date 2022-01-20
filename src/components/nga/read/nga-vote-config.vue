<template>
  <el-descriptions v-if="config" :column="4" border size="small">
    <el-descriptions-item v-if="config.totalUser" :align="align">
      <template #label>
        <el-tag size="small">总人数</el-tag>
      </template>
      <el-tag size="small" type="danger">{{ config.totalUser }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item v-if="config.totalCount" :align="align">
      <template #label>
        <el-tag size="small">总投票</el-tag>
      </template>
      <el-tag size="small" type="danger">{{ config.totalCount }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item v-if="config.totalMoney" :align="align">
      <template #label>
        <el-tag size="small">总投注</el-tag>
      </template>
      <nga-money-text :money="parseMoney(config.totalMoney)" />
    </el-descriptions-item>
    <el-descriptions-item v-if="config.end" :align="align">
      <template #label>
        <el-tag size="small">截止时间</el-tag>
      </template>
      <el-tag size="small" type="danger">{{ config.end }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item v-if="config.min" :align="align">
      <template #label>
        <el-tag size="small">投注范围</el-tag>
      </template>
      <el-tag size="small" type="danger">{{ config.min }}~{{ config.max }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item v-if="config.maxSelect" :align="align">
      <template #label>
        <el-tag size="small">可选数量</el-tag>
      </template>
      <el-tag size="small" type="danger">{{ config.maxSelect }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item v-if="config.priv" :align="align">
      <template #label>
        <el-tag size="small">priv</el-tag>
      </template>
      <el-tag size="small" type="danger">{{ config.priv }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item v-if="config.type" :align="align">
      <template #label>
        <el-tag size="small">type</el-tag>
      </template>
      <el-tag size="small" type="danger">{{ config.type }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item v-if="config.opt" :align="align">
      <template #label>
        <el-tag size="small">opt</el-tag>
      </template>
      <el-tag size="small" type="danger">{{ config.opt }}</el-tag>
    </el-descriptions-item>


  </el-descriptions>
</template>
<script>
import {parseMoney} from "@/assets/request/nga-request";
import NgaMoneyText from "@/components/nga/user/nga-money-text";

export default {
  name: 'nga-vote-config',
  components: {NgaMoneyText},
  props: {
    config: {required: true, type: Object}
  },
  data() {
    return {
      align: 'center',
    }
  },
  methods: {
    parseMoney
  },
}
</script>
<style scoped>

.el-pager li {
  background: rgb(0 0 0 / 0%);
}

</style>