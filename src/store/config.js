// 配置
// noinspection JSUnusedLocalSymbols

import {getCache, putCache} from "@/assets/utils/StorageUtils";
import {ElMessage} from "element-plus";
import {copyObj} from "@/assets/utils/ObjectUtils";

export default {
    namespaced: true,
    state: {
        config: {
            autoRefresh: false,
            style: {
                //  背景颜色
                backgroundColor: "",
                rowColor1: "",
                rowColor2: "",
                textColor: "",
            },
        },
    },
    mutations: {
        async loadConfig(state) {
            state.config = getCache("Config")
            state.config.style = state.config.style ? state.config.style : {}
            console.log(state.config)
            putCache("Config", state.config)
        },
        setConfig(state, {key, value}) {
            if (state.config.hasOwnProperty(key)) {
                state.config[key] = value
                state.config = copyObj(state.config)
                console.slf4j(`修改配置:${key} = ${JSON.stringify(value)}`)
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
    getters: {
        getHeaderRowStyle(state) {
            const {style} = state.config
            const {rowColor2, textColor} = style
            return {
                "background-color": rowColor2,
                color: textColor,
            }
        },
        getRowStyle: (state) => ({rowIndex}) => {
            const {style} = state.config
            const {rowColor1, rowColor2, textColor} = style
            if (rowIndex % 2 === 0) {
                return {
                    "background-color": rowColor1,
                    color: textColor,
                }
            }
            return {
                "background-color": rowColor2,
                color: textColor,
            }
        }
    },
}