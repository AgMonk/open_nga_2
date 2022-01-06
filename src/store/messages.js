// 短消息
// noinspection JSUnusedLocalSymbols

import {getFromCache} from "@/assets/utils/CacheUtils";
import {getMessages} from "@/assets/request/nuke-request";

export default {
    namespaced: true,
    state: {
        messages: {},
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
                expires: 3 * 60,
                force
            }).then(res => res.data)
        },
    },
    getters: {},
}