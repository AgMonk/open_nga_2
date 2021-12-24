import {requestUnity} from "@/assets/request/nga-request";

export const nukeRequest = (data) => {
    return requestUnity({
        url: "nuke.php",
        data
    })
}
//获取收藏版面
export const getFavorForums = () => nukeRequest({
    __lib: "forum_favor2",
    __act: "forum_favor",
    action: "get",
})
//获取提醒消息
export const getNotices = ()=>nukeRequest({
    __lib:'noti',
    raw:3,
    __act:"get_all",
    time_limit:1,
})
//获取指定用户信息
export const getUserInfo = (uid)=>nukeRequest({
    __lib:"ucp",
    __act:"get",
    uid,
})