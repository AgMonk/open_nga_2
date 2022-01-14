// 读取回复
// noinspection JSUnusedLocalSymbols

import {getFromCache} from "@/assets/utils/CacheUtils";
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
                expires: 3 * 60,
                force
            }).then(async res => {
                //保存用户信息
                res.data.userData.users.forEach(user => {
                    commit("users/saveUser", user, {root: true})
                })

                const {replies} = res.data
                const comments = replies.filter(i => i.comment_to_id);
                const commentPid = Array.from(new Set(comments.map((i => i.comment_to_id))))

                for (const pid1 of commentPid) {
                    const map = pid1 === -1 ? await dispatch('getComment', {tid, force}) : await dispatch('getComment', {pid: pid1, force})
                    console.log(map)
                    comments.forEach(i => {
                        Object.assign(i, map[i.pid])
                    })
                }

                replies.forEach(reply => {
                    const {rawAid, tid, pid} = reply
                    reply.seed = rawAid + tid + pid
                })

                return res.data
            })
        },

        getTopicTopContent: ({dispatch, commit, state}, {tid, force}) => {
            return dispatch('getReplies', {tid, force}).then(res => {
                return res.replies[0].content
            })
        },
        //请求一个回复的评论区
        getComment: ({dispatch, commit, state}, {tid, pid, force}) => {
            return dispatch('getReplies', {tid, pid, force}).then(res => {
                const a = {}
                res.replies[0].comment.forEach(i => {
                    delete i.subject
                    delete i.level
                    a[i.pid] = i
                })
                return a
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}