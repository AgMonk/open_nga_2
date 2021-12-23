// 浏览历史记录
// noinspection JSUnusedLocalSymbols

import {slf4j} from "@/assets/utils/LogUtils";

export default {
    namespaced: true,
    state: {
        //版面
        forums:[],
        //主题
        threads:[],
        //合集
        sets:[],
    },
    mutations: {
        addHistoryForum(state, {fid,name,recommend}){
            const n = recommend?`${name}(精华区)`:name;
            slf4j(`添加版面浏览记录 fid:${fid} name:${n}`)
            state.forums = state.forums.filter(i=>i.name!==n)
            state.forums.splice(0,0,{fid,name:n,recommend})
        },
        addHistoryThread(state, {tid,name}){
            slf4j(`添加主题浏览记录 tid:${tid} name:${name}`)
            state.threads = state.threads.filter(i=>i.tid!==tid)
            state.threads.splice(0,0,{tid,name})
        },
        addHistorySet(state, {stid,name,forumName}){
            const n = `${forumName}>${name}`
            slf4j(`添加合集浏览记录 stid:${stid} name:${n}`)
            state.sets = state.sets.filter(i=>i.name!==n)
            state.sets.splice(0,0,{stid,name:n})
        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}