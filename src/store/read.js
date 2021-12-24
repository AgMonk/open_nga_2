// 读取回复
// noinspection JSUnusedLocalSymbols

import {getFromCache} from "@/assets/utils/CacheUtils";
import {cache} from "@vue/cli-service/lib/config/terserOptions";
import {readRequest} from "@/assets/request/nga-request";

export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {},
    actions: {
        getReplies: ({dispatch, commit, state}, {pid, tid, page, authorid, force = false}) => {
            return getFromCache({
                cacheObj: state.cache,
                key: JSON.stringify({pid, tid, page, authorid}),
                requestMethod: () => readRequest({pid, tid, page, authorid}),
                expires: 3*60,
                force
            }).then(res=>{
                //设置面包屑
                commit("breadcrumb/setWithRead",res.data,{root:true})

                //保存用户信息
                res.data.userData.users.forEach(user=>{
                    commit("users/saveUser",user,{root:true})
                })
                return res.data
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}