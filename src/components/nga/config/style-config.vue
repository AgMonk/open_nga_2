<template>
  <!--界面配色 todo-->
  <div>
    <div style="text-align: left">
      <el-select placeholder="使用官方配色" @change="useOfficialStyle">
        <el-option v-for="item in officialStyle" :label="item.name" :value="item" />
      </el-select>
    </div>
    <el-form inline style="text-align: left">
      <el-form-item label="背景颜色">
        <el-color-picker v-model="style.backgroundColor"
                         :predefine="predefineColors"
                         show-alpha
                         @change="updateConfig"
        />
      </el-form-item>
      <el-form-item label="行颜色1">
        <el-color-picker v-model="style.rowColor1"
                         :predefine="predefineColors"
                         show-alpha
                         @change="updateConfig"
      />
    </el-form-item>
    <el-form-item label="行颜色2">
      <el-color-picker v-model="style.rowColor2"
                       :predefine="predefineColors"
                       show-alpha
                       @change="updateConfig"
      />
    </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker v-model="style.textColor"
                         :predefine="predefineColors"
                         show-alpha
                         @change="updateConfig"
        />
      </el-form-item>

    </el-form>

  </div>

</template>

<script>
import {mapMutations, mapState} from "vuex";
import {copyObj} from "@/assets/utils/ObjectUtils";

export default {
  name: "style-config",
  computed: {
    ...mapState('config', ["config"]),
  },
  data() {
    return {
      officialStyle: [
        {
          name: "青色", style: {
            backgroundColor: "#d3dedb",
            rowColor1: "#e1efeb",
            rowColor2: "#f0f7f5",
            textColor: "#10273f",
          },
        },
      ],
      style: {
        backgroundColor: "",
        rowColor1: "",
        rowColor2: "",
        textColor: "",
      },
      predefineColors: [
        '#d3dedb',
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577',
      ]
    }
  },
  methods: {
    ...mapMutations('config', [`setConfig`]),
    useOfficialStyle(e) {
      console.slf4j(`应用官方配色:` + e.name)
      console.log(e)
      this.style = Object.assign({}, this.style, e.style)
      this.updateConfig()
    },
    updateConfig() {
      this.setConfig({key: 'style', value: this.style})
    }
  },
  mounted() {
    this.style = copyObj(this.config.style)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>