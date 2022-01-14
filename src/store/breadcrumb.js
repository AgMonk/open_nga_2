// 面包屑导航栏
// noinspection JSUnusedLocalSymbols

export default {
    namespaced: true,
    state: {
        breadcrumbs:[],
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

            state.breadcrumbs = a;
            // console.slf4j(`面包屑更新: ${a.map(i => i.name).join(' > ')}`)
        },
        setWithThread(state, {forum,recommend}){
            const a = [];
            //    版面
            a.push({type:'版面',fid:forum.fid,name:forum.name,})
            //    合集
            if (forum.setName){
                a.push({type:'合集',stid:forum.toppedTid,name:forum.setName})
            }
            //是否为精华区
            if (recommend){
                a.push({type:'精华区',fid:forum.fid,name:'精华区',})
            }
            state.breadcrumbs = a;
            // console.slf4j(`面包屑更新: ${a.map(i => i.name).join(' > ')}`)
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}