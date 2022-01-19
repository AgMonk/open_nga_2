import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './assets/utils/DateFormat'
import './assets/utils/LogUtils'
import Clipboard from 'v-clipboard3';

import VideoPlayer from 'vue-video-player/src'

require('vue-video-player/src/custom-theme.css')
// require('vue-video-player/node_modules/video.js/dist/video-js.css')
require('video.js/dist/video-js.css')

createApp(App)
    .use(ElementPlus, {locale: zhCn,})
    .use(Clipboard)
    .use(VideoPlayer)
    .use(store).use(router).mount('#app')
