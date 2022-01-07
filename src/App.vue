<template>
  <my-navigation />
  <div :style="style">
    <div style="text-align: left;margin-top: 2px;margin-bottom: 2px">
      <el-button size="small" type="primary" @click="back"><span style="font-weight: bold">返回</span></el-button>
      <el-button size="small" type="primary" @click="forward"><span style="font-weight: bold">前进</span></el-button>
    </div>
    <router-view />
  </div>
  <notice />

  <el-link href="https://github.com/AgMonk/open_nga_2" target="_blank">[GitHub]</el-link>
  <el-backtop :bottom="100">
    <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
    >
      UP
    </div>
  </el-backtop>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import NgaBreadcrumb from "@/components/nga/nga-breadcrumb";
import MyNavigation from "@/components/my/my-navigation";
import {mapActions, mapMutations, mapState} from "vuex";
import Notice from "@/views/Notice";
import {keypressEvent, scrollMethods} from "@/assets/utils/DomUtils";

export default {
  components: {Notice, MyNavigation, NgaBreadcrumb},
  computed: {
    ...mapState('config', ["config"]),
  },
  methods: {
    ...mapMutations('config', [`loadConfig`]),
    ...mapActions("users", [`loadCurrentUser`]),
    ...mapMutations("users", [`loadUsername`]),
    back(e) {
      history.back()
    },
    forward(e) {
      history.forward()
    },
    keypress(e) {
      const {srcElement} = e;
      if (srcElement.nodeName === 'TEXTAREA') {
        return;
      }

      const methods = {
        ...scrollMethods,
        q: () => this.back(),
        e: () => this.forward(),
      }
      keypressEvent(e, methods)
    },
    updateStyle(config) {
      const {style} = config;
      this.style = `background-color:${style.backgroundColor};color:${style.textColor}`;
    }
  },
  async mounted() {
    await this.loadUsername()
    await this.loadCurrentUser()
    await this.loadConfig()
    document.addEventListener('keypress', this.keypress)

    this.updateStyle(this.config)
  },
  watch: {
    config(to) {
      this.updateStyle(to)
    }
  },
  unmounted() {
    document.removeEventListener('keypress', this.keypress)
  },
  data() {
    return {
      style: '',
    }
  }
}
</script>