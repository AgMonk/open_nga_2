<template>
  <my-navigation />
  <div :style="style">
    <div v-if="clientMode==='PC端'" style="text-align: left;margin-top: 2px;margin-bottom: 2px">
      <el-button size="small" type="primary" @click="back"><span style="font-weight: bold">返回</span></el-button>
      <el-button size="small" type="primary" @click="forward"><span style="font-weight: bold">前进</span></el-button>
    </div>
    <router-view />
  </div>
  <notice />
  <current-user-avatar v-if="currentUser" />

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

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
<script>
import MyNavigation from "@/components/my/my-navigation";
import {mapActions, mapMutations, mapState} from "vuex";
import Notice from "@/views/Notice";
import {keypressEvent, scrollMethods} from "@/assets/utils/DomUtils";
import CurrentUserAvatar from "@/views/CurrentUserAvatar";

export default {
  components: {CurrentUserAvatar, Notice, MyNavigation},
  computed: {
    ...mapState('config', ["config"]),
    ...mapState('client', [`clientMode`]),
    ...mapState("users", [`currentUser`]),
  },
  methods: {
    ...mapMutations('config', [`loadConfig`]),
    ...mapActions("users", [`loadCurrentUser`]),
    ...mapMutations("users", [`loadUsername`]),
    ...mapMutations("history", [`loadHistory`]),
    ...mapMutations("client", [`init`]),
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
    this.init();
    await this.loadUsername()
    await this.loadHistory()
    await this.loadCurrentUser()
    await this.loadConfig()
    document.addEventListener('keypress', this.keypress)

    this.updateStyle(this.config)
    // console.log(getClientSize())
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

<style>
/*在Chrome下移除input[number]的上下箭头*/
.no-number::-webkit-outer-spin-button,
.no-number::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none !important;
}

.no-number input[type="number"]::-webkit-outer-spin-button,
.no-number input[type="number"]::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none !important;
}

/*在firefox下移除input[number]的上下箭头*/
.no-number {
  -moz-appearance: textfield;
}

.no-number input[type="number"] {
  -moz-appearance: textfield;
}
</style>