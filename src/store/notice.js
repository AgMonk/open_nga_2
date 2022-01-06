// 提醒消息
// noinspection JSUnusedLocalSymbols

import {clearNotice, getNotices} from "@/assets/request/nuke-request";

//筛选出新消息，添加到旧列表前方
const setUnread = (oldArray, newArray) => {
    const uuid = oldArray.map(i => i.uuid)
    const list = newArray.filter(i => !uuid.includes(i.uuid))
    list.forEach(i => i.unread = true);
    oldArray.splice(0, 0, ...list)
    // console.log(oldArray)
}


export default {
    namespaced: true,
    state: {
        //回复
        replies: [],
        //短消息
        pm: [],
        //赞踩
        approbation: [],
    },
    mutations: {},
    actions: {
        updateNotice: async ({dispatch, commit, state}) => {
            const notices = await getNotices();
            const {data} = notices;
            const {replies, pm, approbation} = data;

            if (replies) {
                setUnread(state.replies, replies)
            } else {
                state.replies = []
            }

            if (pm) {
                setUnread(state.pm, pm)
            } else {
                state.pm = []
            }

            if (approbation) {
                setUnread(state.approbation, approbation)
            } else {
                state.approbation = []
            }

        },
        clearNotice: ({dispatch, commit, state}) => {
            return clearNotice().then(res => {
                state.replies = []
                state.pm = []
                state.approbation = []
                return res.data
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}