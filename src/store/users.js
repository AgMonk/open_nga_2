// 用户信息
// noinspection JSUnusedLocalSymbols

import {getUserInfo} from "@/assets/request/nuke-request";
import {getCookieMap, setCookies} from "@/assets/utils/CookieUtils";
import {checkStorageSize, delCache, getCache, putCache} from "@/assets/utils/StorageUtils";
import {ElMessage} from "element-plus";
import {slf4j} from "@/assets/utils/LogUtils";
import {obj2Array} from "@/assets/utils/ObjectUtils";

const splitter = ',';

const stringifyUsername = (userArray) => {
    const a = []
    userArray.forEach(u => {
        const {uid, username} = u;
        a.push(uid)
        a.push(username)
    })
    return a.join(splitter);
}

const parseUsername = (array) => {
    const a = []
    const data = array.split(splitter)
    for (let i = 0; i < data.length; i += 2) {
        a.push({
            uid: data[i],
            username: data[i + 1]
        })
    }
    return a;
}


const saveU = (state, user) => {
    const uid = user.uid
    const u = state.users[uid]
    if (u) {
        //    数据已存在
        Object.assign(u, user)
    } else {
        state.users[uid] = user
    }
};

export default {
    namespaced: true,
    state: {
        users: {},
        accounts: [],
        currentUser: undefined,
    },
    mutations: {
        loadUsername: (state) => {
            const size = checkStorageSize() / 1024;
            slf4j(`storage已存储 ${(size).toFixed(2)} KB数据`)
            if (size > 2400) {
                slf4j('数据存储过多，清空')
                delCache("Username")
            } else {
                const cache = getCache("Username");
                if (cache) {
                    const uu = parseUsername(cache);
                    uu.forEach(u => {
                        saveU(state, u)
                    })
                    slf4j(`加载用户名缓存 ${uu.length}个`)
                }
            }
        },
        saveUser: (state, user) => {
            saveU(state, user);
            // console.log(state.users[uid])
            putCache("Username", stringifyUsername(obj2Array(state.users)))
        },
        loadAccounts: (state) => {
            state.accounts = getCache("accounts")
            state.accounts = state.accounts ? state.accounts : []
            slf4j("加载所有账号信息")
            console.log(state.accounts)
        },
        delAccount: (state, uid) => {
            state.accounts = state.accounts ? state.accounts.filter(i => i.uid !== uid) : []
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
        loadCurrentUser: ({dispatch, commit, state}) => {
            const uid = getCache("currentUser")
            return uid ? dispatch("getUserInfo", uid).then(res => {
                state.currentUser = res
                const {uid, username} = res
                slf4j(`加载当前账号用户信息 ${username}(${uid})`)
                return res
            }) : undefined
        },
        loginWithCookie: async ({dispatch, commit, state}, cookie) => {
            setCookies(cookie, 90, "/nga-api")
            let map = getCookieMap(cookie)
            const uid = map.ngaPassportUid;
            const info = await dispatch("getUserInfo", uid)
            console.log(info)
            if (info && (info.email || info.phone)) {
                //    登陆成功
                commit("delAccount", uid)
                state.accounts.push({uid, username: info.username, cookie})
                console.log(state.accounts)
                putCache("accounts", state.accounts)

                putCache("currentUser", uid)

                state.currentUser = info;

                ElMessage.success(`登陆成功 [${info.username}]`)
                return info
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {
        getUserArray(state) {
            return obj2Array(state.users).map(i => {
                const {uid, username} = i
                return {uid, username}
            })
        }
    },
}