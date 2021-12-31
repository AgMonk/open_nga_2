// 用户信息
// noinspection JSUnusedLocalSymbols

import {getUserInfo} from "@/assets/request/nuke-request";
import {getCookieMap, setCookies} from "@/assets/utils/CookieUtils";
import {getCache, putCache} from "@/assets/utils/StorageUtils";
import {ElMessage} from "element-plus";
import {slf4j} from "@/assets/utils/LogUtils";

export default {
    namespaced: true,
    state: {
        users: {},
        accounts: [],
        currentUser:{},
    },
    mutations: {
        saveUser: (state, user) => {
            const uid = user.uid
            const u = state.users[uid]
            // console.log(user)
            if (u) {
                //    数据已存在
                Object.assign(u, user)
            } else {
                state.users[uid] = user
            }
            // console.log(state.users[uid])
        },
        loadAccounts: (state) => {
            state.accounts = getCache("accounts")
            slf4j("加载所有账号信息")
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
        loadCurrentUser:({dispatch, commit, state})=>{
            const uid = getCache("currentUser")
            return dispatch("getUserInfo", uid).then(res=>{
                state.currentUser = res
                const {uid, username} = res
                slf4j(`加载当前账号用户信息 ${username}(${uid})`)
                return res
            })
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

                state.currentUser = info;

                ElMessage.success(`登陆成功 [${info.username}]`)
                return info
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}