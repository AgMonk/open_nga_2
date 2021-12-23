// 主题
// noinspection JSUnusedLocalSymbols

import {threadByForum, threadBySet} from "@/assets/request/nga-request";
import {getFromCache} from "@/assets/utils/CacheUtils";

export default {
    namespaced: true,
    state: {
        cache:{}
    },
    mutations: {},
    actions: {
        getThreadsOfForum: ({dispatch, commit, state}, {page, fid, orderByPostDateDesc, recommend, force}) => {
            const param = {page, fid, orderByPostDateDesc, recommend};
            return getFromCache({
                cacheObj: state.cache,
                key: JSON.stringify(param),
                requestMethod: () => threadByForum(param),
                expires: 3,
                force
            }).then(res => {
                //设置面包屑
                commit("breadcrumb/setWithThread",{forum:res.data.forum,recommend},{root:true})
                return res
            })
        },
        getThreadsOfSet: ({dispatch, commit, state}, {page, stid, orderByPostDateDesc, force}) => {
            const param = {page, stid, orderByPostDateDesc, force}
            return getFromCache({
                cacheObj: state.cache,
                key: JSON.stringify(param),
                requestMethod: () => threadBySet(param),
                expires: 3,
                force
            }).then(res => {
                //设置面包屑
                commit("breadcrumb/setWithThread", {forum:res.data.forum},{root:true})
                return res
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}