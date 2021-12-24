// 用户信息
// noinspection JSUnusedLocalSymbols

import {getUserInfo} from "@/assets/request/nuke-request";

export default {
    namespaced: true,
    state: {
        users: {},
    },
    mutations: {
        saveUser: (state, user) => {
            const uid = user.uid
            const u = state.users[uid]
            if (u) {
                //    数据已存在
                Object.assign(u, user)
            } else {
                state.users[uid] = user
            }
        },
    },
    actions: {
        getUserInfo: async ({dispatch, commit, state}, uid) => {
            if (!state.users[uid] || !state.users[uid].totalAgreement) {
                const res = await getUserInfo(uid);
                commit("saveUser", res)
            }
            return state.users[uid]
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}