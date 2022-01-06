// 短消息
// noinspection JSUnusedLocalSymbols

import {getFromCache} from "@/assets/utils/CacheUtils";
import {getMessages, readMessage} from "@/assets/request/nuke-request";

export default {
    namespaced: true,
    state: {
        messages: {},
        replies: {},
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        listMessages: ({dispatch, commit, state}, {page, force}) => {
            return getFromCache({
                cacheObj: state.messages,
                key: `page:${page}`,
                requestMethod: () => getMessages(page),
                expires: 10,
                force
            }).then(res => res.data)
        },
        readMessage: ({dispatch, commit, state}, {mid, page, force}) => {
            return getFromCache({
                cacheObj: state.replies,
                key: `mid:${mid} page:${page}`,
                requestMethod: () => readMessage(mid, page),
                expires: 5,
                force
            }).then(res => res.data).then(res => {
                res.userData.users.forEach(user => {
                    commit("users/saveUser", user, {root: true})
                })
                return res;
            })
        },
    },
    getters: {},
}