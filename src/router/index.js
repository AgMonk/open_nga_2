import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Search from "@/views/Search";
import SearchTab from "@/views/SearchTab";

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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Search
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
