// 客户端状态
// noinspection JSUnusedLocalSymbols

import {getClientSize} from "@/assets/utils/ClientUtils";

export default {
    namespaced: true,
    state: {
        clientWidth: 0,
        clientHeight: 0,
        direction: '',
    },
    mutations: {
        init(state) {
            setInterval(() => {
                const {clientWidth, clientHeight} = getClientSize();
                state.clientHeight = clientHeight
                state.clientWidth = clientWidth
                state.direction = clientWidth >= clientHeight ? '横屏' : '竖屏';
                console.log({clientWidth, clientHeight, direction: state.direction})
            }, 2000)
        },
        method(state, payload) {

        },

    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}