// 搜索
// noinspection JSUnusedLocalSymbols

import {getFromCache} from "@/assets/utils/CacheUtils";
import {searchByUser, searchInSet, searchInThread, threadByForum} from "@/assets/request/nga-request";

export default {
    namespaced: true,
    state: {
        author: {},
        thread: {},
        set: {},
    },
    mutations: {},
    actions: {

        getSearchInThread: ({dispatch, commit, state}, {page, key, fid, recommend, content, force}) => {
            const param = {page, key, fid, recommend, content};
            return getFromCache({
                cacheObj: state.thread,
                key: JSON.stringify(param),
                requestMethod: () => searchInThread(param),
                expires: 3 * 60,
                force
            })
        },
        getSearchInSet: ({dispatch, commit, state}, {page, key, stid, content, force}) => {
            const param = {page, key, stid, content};
            return getFromCache({
                cacheObj: state.thread,
                key: JSON.stringify(param),
                requestMethod: () => searchInSet(param),
                expires: 3 * 60,
                force
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}