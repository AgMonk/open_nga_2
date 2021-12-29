// 提醒消息
// noinspection JSUnusedLocalSymbols

import {getNotices} from "@/assets/request/nuke-request";

const setUnread = (oldArray, newArray) => {
    const uuid = oldArray.map(i => i.uuid)
    const list = newArray.filter(i => !uuid.includes(i.uuid))
    list.forEach(i => i.unread = true);
    console.log(list)
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
                state.replies = replies;
            } else {
                state.replies = []
            }

            if (pm) {
                setUnread(state.pm, pm)
                state.pm = pm;
            } else {
                state.pm = []
            }

            if (approbation) {
                setUnread(state.approbation, approbation)
                state.approbation = approbation;
            } else {
                state.approbation = []
            }


        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}