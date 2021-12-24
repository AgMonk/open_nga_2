import {parseAvatar, parseMoney, requestUnity} from "@/assets/request/nga-request";
import {second2String} from "@/assets/utils/DateFormat";
import {obj2Array} from "@/assets/utils/ObjectUtils";

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
}).then(res => {
    const nukeData = res.data["0"];
    res.data.favorForums = obj2Array(nukeData).sort((a, b) => a.id - b.id)
    return res;

})
//获取提醒消息
export const getNotices = () => nukeRequest({
    __lib: 'noti',
    raw: 3,
    __act: "get_all",
    time_limit: 1,
}).then(res => {
    const nukeData = res.data["0"];
    //    提醒消息

    //回复
    let replies = nukeData["0"]
    replies = !replies ? undefined : replies.map(r => {
        const timestamp = {
            time: r["9"],
            timestamp: second2String(r["9"])
        }
        const from = {
            uid: r["1"],
            name: r["2"],
        }
        const thread = {
            tid: r["6"],
            subject: r["5"],
            page: r["10"],
        }
        const to = {
            uid: r["3"],
            name: r["4"],
        }
        const reply = {
            from: r["7"],
            to: r["8"],
        }
        let type;
        switch (r['0']) {
            case 1:
                type = '对主题';
                break;
            case 2:
                type = '对回复';
                break;
            case 8:
                type = '送礼物';
                break;
            case 15:
                type = '@你';
                break;
            default:
                type = '';
                break;
        }
        return {
            type, timestamp, thread, reply, user: {from, to,}
        }
    }).reverse();
    //短消息
    let pm = nukeData["1"];
    pm = !pm ? undefined : pm.map(r => ({
        from: {
            uid: r["1"],
            name: r["2"],
        },
        mid: r["6"],
        timestamp: {
            time: r["9"],
            timestamp: second2String(r["9"])
        }
    })).reverse();

    //赞踩
    let approbation = nukeData["2"];
    approbation = !approbation ? undefined : approbation.map(r => ({
        uid: r["3"],
        thread: {
            tid: r["6"],
            subject: r["5"],
        },
        pid: r["7"],
        timestamp: {
            time: r["9"],
            timestamp: second2String(r["9"])
        }
    })).reverse();

    res.data.replies = replies
    res.data.pm = pm
    res.data.approbation = approbation

    delete res.data["0"]

    return res;
})
//获取指定用户信息
export const getUserInfo = (uid) => nukeRequest({
    __lib: "ucp",
    __act: "get",
    uid,
}).then(res => {
    const nukeData = res.data["0"];
    //    用户信息
    const {group, groupid, medal, more_info, regdate, uid,avatar,email,money,phone,sign,rvrc,posts,username} = nukeData
    const user = {
        uid,email,phone,
        groupId: groupid,
        groupName: group,
        rvrc:rvrc/10,
        timestamp: {
            reg: {time: regdate, value: second2String(regdate)}
        },
    }
    const medals = typeof medal ==="string"?medal.split(","):undefined;
    if (medals){
        user.medals = medals;
    }
    const ava = parseAvatar(avatar)
    if (ava){
        user.avatar = ava;
    }
    const mon = parseMoney(money)
    if (mon){
        user.money = mon;
    }
    if (sign && sign.length > 0){
        user.signature = sign
    }
    if (posts && posts>0){
        user.postCount = posts
    }
    if (username && !username.startsWith('UID')){
        user.username = username
    }
    //总赞数
    const a = obj2Array(more_info).filter(i => i.type === 8)[0]
    if (a) {
        user.totalAgreement = a.data
    }
    res.data.user = user;
    return user;

})