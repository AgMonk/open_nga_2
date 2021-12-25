// 主题
// noinspection JSUnusedLocalSymbols

import {threadByForum, threadBySet, threadFavor} from "@/assets/request/nga-request";
import {getFromCache} from "@/assets/utils/CacheUtils";

export default {
    namespaced: true,
    state: {
        cache: {}
    },
    mutations: {},
    actions: {
        getThreadsOfForum: ({dispatch, commit, state}, {page, fid, orderByPostDateDesc, recommend, force}) => {
            const param = {page, fid, orderByPostDateDesc, recommend};
            return getFromCache({
                cacheObj: state.cache,
                key: JSON.stringify(param),
                requestMethod: () => threadByForum(param),
                expires: 3 * 60,
                force
            })
        },
        getThreadsOfSet: ({dispatch, commit, state}, {page, stid, orderByPostDateDesc, force}) => {
            const param = {page, stid, orderByPostDateDesc, force}
            return getFromCache({
                cacheObj: state.cache,
                key: JSON.stringify(param),
                requestMethod: () => threadBySet(param),
                expires: 3 * 60,
                force
            })

        },
        getFavor: ({dispatch, commit, state}, {page, force}) => {
            return getFromCache({
                cacheObj: state.cache,
                key: 'favor',
                requestMethod: () => threadFavor(page),
                expires: 3 * 60,
                force
            })
        },

        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}