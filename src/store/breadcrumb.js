// 面包屑导航栏
// noinspection JSUnusedLocalSymbols

export default {
    namespaced: true,
    state: {
        data:[],
    },
    mutations: {
        //使用主题数据设置面包屑
        setWithRead(state, {forum,thread}){
            const a = [];
            const {subForum} = thread;
        //    版面
            a.push({type:'版面',fid:thread.fid,name:forum.name,})
        //    合集
            if (subForum){
                a.push({type:'合集',stid:subForum.tid,name:subForum.subject})
            }
        //    主题
            a.push({type:'主题',tid:thread.tid,name:thread.subject})

            state.data = a;
            console.slf4j("面包屑更新")
            console.log(a)
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}