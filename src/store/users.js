// 用户信息
// noinspection JSUnusedLocalSymbols

import {getUserInfo} from "@/assets/request/nuke-request";
import {getCookieMap, setCookies} from "@/assets/utils/CookieUtils";
import {getCache, putCache} from "@/assets/utils/StorageUtils";
import {ElMessage} from "element-plus";

export default {
    namespaced: true,
    state: {
        users: {},
        accounts: [],
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
        loadAccounts: (state) => {
            state.accounts = getCache("accounts")
            console.log("加载账号信息")
            console.log(state.accounts)
        },
        delAccount:(state,uid)=>{
            state.accounts = state.accounts.filter(i => i.uid !== uid)
            putCache("accounts", state.accounts)
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
        getCurrentUser:({dispatch, commit, state})=>{
            const uid = getCache("currentUser")
            return dispatch("getUserInfo", uid)
        },
        loginWithCookie: async ({dispatch, commit, state}, cookie) => {
            setCookies(cookie, 90, "/nga-api")
            let map = getCookieMap(cookie)
            const uid = map.ngaPassportUid;
            const info = await dispatch("getUserInfo", uid)
            console.log(info)
            if (info && info.phone) {
                //    登陆成功
                commit("delAccount",uid)
                state.accounts.push({uid, username: info.username, cookie})
                console.log(state.accounts)
                putCache("accounts", state.accounts)

                putCache("currentUser",uid)

                ElMessage.success(`登陆成功 [${info.username}]`)
                return info
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}