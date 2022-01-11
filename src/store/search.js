// 搜索
// noinspection JSUnusedLocalSymbols

import {getFromCache} from "@/assets/utils/CacheUtils";
import {searchInSet, searchInThread} from "@/assets/request/nga-request";

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
            }).then(res => {
                //保存用户信息
                res.data.threads.forEach(thread => {
                    commit("users/saveUser", thread.author, {root: true})
                })
                return res.data
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
            }).then(res => {
                //保存用户信息
                res.data.threads.forEach(thread => {
                    commit("users/saveUser", thread.author, {root: true})
                })
                return res.data
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}