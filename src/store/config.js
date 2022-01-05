// 配置
// noinspection JSUnusedLocalSymbols

import {getCache, putCache} from "@/assets/utils/StorageUtils";
import {ElMessage} from "element-plus";

export default {
    namespaced: true,
    state: {
        config: {
            autoRefresh: false,
        },
    },
    mutations: {
        async loadConfig(state) {
            state.config = getCache("Config")
            console.log(state.config)
        },
        setConfig(state, {key, value}) {
            if (state.config.hasOwnProperty(key)) {
                state.config[key] = value
                console.slf4j(`修改配置:${key} = ${value}`)
                putCache("Config", state.config)
            } else {
                ElMessage.error(`不存在指定的配置名 ${key}`)
            }
        },
        method(state, payload) {

        },

    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}