// 版面
// noinspection JSUnusedLocalSymbols

import {getFromCache} from "@/assets/utils/CacheUtils";
import {readRequest} from "@/assets/request/nga-request";
import {getFavorForums} from "@/assets/request/nuke-request";

export default {
    namespaced: true,
    state: {
        favor:{},
    },
    mutations: {},
    actions: {
        getFavorForums: ({dispatch, commit, state},force) => {
            return getFromCache({
                cacheObj: state.favor,
                key: 'favor',
                requestMethod: getFavorForums,
                expires: 3*60,
                force
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}