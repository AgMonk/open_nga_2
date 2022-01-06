import {parseAvatar, parseMoney, requestUnity} from "@/assets/request/nga-request";
import {second2String} from "@/assets/utils/DateFormat";
import {obj2Array} from "@/assets/utils/ObjectUtils";
import {parseBitData} from "@/assets/request/bitUtils";

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
            value: second2String(r["9"])
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
                type = '@你';
                break;
            case 15:
                type = '送礼物';
                break;
            default:
                type = '';
                break;
        }
        const uuid = `${reply.from}${timestamp.time}`;
        return {
            type, timestamp, thread, reply, user: {from, to,}, uuid
        }
    }).reverse();
    //短消息
    let pm = nukeData["1"];
    pm = !pm ? undefined : pm.map(r => ({
        type: r["0"] === 10 ? '发起对话' : (r["0"] === 11 ? '回复对话' : undefined),
        from: {
            uid: r["1"],
            name: r["2"],
        },
        mid: r["6"],
        timestamp: {
            time: r["9"],
            value: second2String(r["9"])
        },
        uuid: r['6'] + r['9']
    })).reverse();

    //赞踩
    let approbation = nukeData["2"];
    approbation = !approbation ? undefined : approbation.map(r => ({
        uid: r["3"],
        thread: {
            tid: r["6"],
            subject: r["5"],
            page: r["10"],
        },
        reply: {
            to: r["7"],
        },
        timestamp: {
            time: r["9"],
            value: second2String(r["9"])
        },
        uuid: r['6'] + r['9']
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
    // console.log(nukeData)
    //    用户信息
    const {group, groupid, medal, more_info, regdate, uid, avatar, email, money, phone, sign, rvrc, posts, username, muteTime, verified} = nukeData

    const user = {
        uid,
        groupId: groupid,
        groupName: group,
        // rvrc:rvrc/10,
        timestamp: {
            reg: {time: regdate, value: second2String(regdate)}
        },
    }
    const medals = typeof medal === "string" ? medal.split(",") : undefined;
    if (medals) {
        user.medals = medals;
    }
    if (email) {
        user.email = email;
    }
    if (phone) {
        user.phone = phone;
    }
    const ava = parseAvatar(avatar)
    if (ava) {
        user.avatar = ava;
    } else {
        delete user.avatar
    }
    const mon = parseMoney(money)
    if (mon) {
        user.money = mon;
    }
    if (sign && sign.length > 0) {
        user.signature = sign
    }
    if (posts && posts > 0) {
        user.postCount = posts
    }
    if (username && !username.startsWith('UID')) {
        user.username = username
    }
    //总赞数
    const a = obj2Array(more_info).filter(i => i.type === 8)[0]
    if (a) {
        user.totalAgreement = a.data
    }
    if (muteTime && muteTime > 0) {
        user.timestamp.mute = {time: muteTime, value: second2String(muteTime)}
    }

    if (verified) {
        let status;
        switch (verified) {
            case 4:
                status = '已激活(手机/关联)';
                break;
            case 1:
                status = '已激活';
                break;
            case 0:
                status = '未激活';
                break;
            case -1:
                status = 'NUKED';
                break;
            default:
                status = '其他';
                break;
        }
        user.accountStatus = {
            status, verified
        }
    }
    // console.log(user)
    res.data.user = user;
    return user;

})
// 赞踩
export const agree = (tid, pid, value = 1) => nukeRequest({
    __lib: "topic_recommend",
    __act: "add",
    tid,
    pid,
    value,
    raw: 3,
}).then(res => {
    const {data} = res;
    return {
        message: data[0],
        value: data[1],
    }
})
// 清空提醒
export const clearNotice = () => nukeRequest({
    __lib: "noti",
    __act: "del",
    raw: 3,
})

//举报
export const report = ({tid, pid, info}) => nukeRequest({
    tid, pid, info, raw: 3,
    __lib: "log_post",
    __act: "report",
})


//删除附件
// noinspection SpellCheckingInspection
export const delAttach = ({tid, pid, aid}) => nukeRequest({
    func: "delattach",
    tid, pid, aid,
    raw: 3,
})
//添加收藏
export const addFavor = ({tid, pid}) => nukeRequest({
    __lib: "topic_favor"
    , __act: "topic_favor"
    , action: "add"
    , raw: 3
    , tid, pid
    , nouse: "post"
})
//移除收藏
export const delFavor = ({tidarray, page = 1}) => nukeRequest({
    __lib: "topic_favor"
    , __act: "topic_favor"
    , raw: 3
    , action: "del"
    , tidarray
    , page
})
//获取短消息列表
export const getMessages = (page) => nukeRequest({
    __lib: "message"
    , __act: "message"
    , act: "list"
    , page
}).then(res => {
    console.log(res)
    if (res.data && res.data[0]) {
        const data = res.data[0];
        const {rowsPerPage, nextPage, currentPage} = data
        const pageData = {
            pageSize: rowsPerPage,
            hasNext: nextPage === '1',
            currentPage,
        }
        delete data.rowsPerPage
        delete data.nextPage
        delete data.currentPage

        const messages = obj2Array(res.data[0]).map(data => {
            const {all_user, bit, from, from_username, last_from, last_from_username, last_modify, mid, posts, sbit, subject, time} = data
            const timestamp = {
                create: {
                    time,
                    value: second2String(time)
                },
                lastModify: {
                    time: last_modify,
                    value: second2String(last_modify)
                }
            }
            const bitData = bit ? parseBitData(bit) : "0";
            const [multiUsers, unread] = bitData.split('').map(i => i === '1');
            const users = {
                author: {uid: from, username: from_username},
                lastReply: {uid: last_from, username: last_from_username},
            }

            return {
                timestamp, users, mid, replies: posts, subject, multiUsers, unread
            }
        })

        res.data = {
            pageData,
            messages,
        }
        return res
    }
})