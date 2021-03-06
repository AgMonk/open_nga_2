// 版面
// noinspection JSUnusedLocalSymbols

import {getFromCache} from "@/assets/utils/CacheUtils";
import {getFavorForums} from "@/assets/request/nuke-request";
import {forumRequest} from "@/assets/request/forum-request";

export default {
    namespaced: true,
    state: {
       cache:{
       }
    },
    mutations: {},
    actions: {
        getFavorForums: ({dispatch, commit, state}, force=false) => {
            return getFromCache({
                cacheObj: state.cache,
                key: 'favor',
                requestMethod: getFavorForums,
                expires: 10 * 60,
                force
            }).then(res => res.data.favorForums)
        },
        searchForum: async ({dispatch, commit, state}, {key,page,force=false}) => {
            return getFromCache({
                cacheObj: state.cache,
                key: '搜索版面:' + JSON.stringify({key, page}),
                requestMethod: () => forumRequest({key, page}),
                expires: 3 * 60,
                force
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}