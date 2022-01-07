import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Search from "@/views/search/Search";
import SearchTab from "@/views/search/SearchTab";
import Read from "@/views/read/Read";
import ReadTab from "@/views/read/ReadTab";
import ThreadTab from "@/views/thread/ThreadTab";
import Thread from "@/views/thread/Thread";
import My from "@/views/My";
import Config from "@/views/Config";
import User from "@/views/User";
import Tips from "@/views/Tips";
import Post from "@/views/Post";
import Messages from "@/views/message/Messages";
import MessageList from "@/views/message/MessageList";
import MessageRead from "@/views/message/MessageRead";
import MessageNew from "@/views/message/MessageNew";

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: '主页',
        component: Home
    },
    {
        path: '/search/:key',
        name: '搜索',
        children: [
            {path: "f/:fid/:page", name: "搜索版面主题", component: SearchTab},
            {path: "s/:stid/:page", name: "搜索合集主题", component: SearchTab},
        ],
        component: Search
    },
    {
        path: '/thread',
        name: '主题列表',
        children: [
            {path: "f/:fid/:page", name: "浏览版面主题", component: ThreadTab},
            {path: "s/:stid/:page", name: "浏览合集主题", component: ThreadTab},
            {path: "a/:authorid/:page", name: "搜索用户发言", component: ThreadTab},
        ],
        component: Thread
    },
    {
        path: '/read',
        name: '回复',
        children: [
            {path: "p/:pid", name: "单个回复", component: ReadTab},
            {path: "t/:tid", redirect: "/read/t/:tid/1"},
            {path: "t/:tid/:page", name: "回复列表", component: ReadTab},
        ],
        component: Read
    },
    {
        path: '/user/:uid',
        name: '用户中心',
        component: User,
    },
    {
        path: "/my",
        name: "我的",
        component: My,
        children: [
            {path: "config", name: "配置", component: Config},
            {path: "favor/:page", name: "已收藏主题", component: ThreadTab},
            {path: "tips", name: "关于", component: Tips,},
            {
                path: "messages", name: "短消息", component: Messages,
                children: [
                    {path: "list/:page", name: "短消息列表", component: MessageList},
                    {path: "read/:mid/:page", name: "短消息阅读", component: MessageRead},
                    {path: "new", name: "短消息发起", component: MessageNew},
                ]
            },
        ]
    },
    {
        path: "/post/:action",
        name: "发帖",
        component: Post,
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
