import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Search from "@/views/Search";
import SearchTab from "@/views/SearchTab";
import Read from "@/views/Read";
import ReadTab from "@/views/ReadTab";
import ThreadTab from "@/views/ThreadTab";
import Thread from "@/views/Thread";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/search/:key',
        name: '搜索',
        children: [
            {path: "f/:fid/:page",name:"搜索版面主题",component:SearchTab},
            {path: "s/:stid/:page",name:"搜索合集主题",component:SearchTab},
        ],
        component: Search
    },
    {
        path: '/thread',
        name: '搜索',
        children: [
            {path: "f/:fid/:page",name:"浏览版面主题",component:ThreadTab},
            {path: "s/:stid/:page",name:"浏览合集主题",component:ThreadTab},
        ],
        component: Thread
    },
    {
        path: '/read',
        name: '回复',
        children: [
            {path: "p/:pid",name:"单个回复",component:ReadTab},
            {path: "t/:tid",redirect:"/read/t/:tid/1"},
            {path: "t/:tid/:page",name:"回复列表",component:ReadTab},
        ],
        component: Read
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
