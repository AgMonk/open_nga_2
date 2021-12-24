import axios from "axios";
import {second2String} from "@/assets/utils/DateFormat";
import {copyObj, obj2Array} from "@/assets/utils/ObjectUtils";
import {parseColor, parseThreadTypeBit} from "@/assets/request/bitUtils";

// 配合Form-Data传递参数
const transformRequest = [
    (data) => {
        //构造地址栏参数
        const a = [];
        for (let key in data) {
            if (data.hasOwnProperty(key) && data[key]) {
                const k = encodeURIComponent(key)
                const v = encodeURIComponent(data[key])
                a.push(`${k}=${v}`)
            }
        }
        return a.join("&")
    },
    // (data) => {
    //     console.log(data)
    //     return data
    // },
]

const handleColor = thread => {
    const bitData = thread.hasOwnProperty('titlefont') ? parseColor(thread.titlefont) : parseColor(thread.topic_misc)
    if (bitData) {
        const colorData = bitData.substring(0, 5)
        const fontData = bitData.substring(5)
        let color = 'black';
        const bold = fontData[0] === '1'
        const italic = fontData[1] === '1'
        const lineThrough = fontData[2] === '1'

        if (colorData.includes("1")) {
            const index = colorData.indexOf("1");
            switch (index) {
                case 0:
                    color = 'red';
                    break;
                case 1:
                    color = 'blue';
                    break;
                case 2:
                    color = 'green';
                    break;
                case 3:
                    color = 'orange';
                    break;
                case 4:
                    color = 'silver';
                    break;
                default:
                    color = undefined;
                    break;
            }
        }
        const style = {
            color,
            "text-decoration": lineThrough ? 'line-through' : 'none',
            "font-weight": bold ? 'bold' : 'normal',
            "font-style": italic ? 'italic' : 'normal',
        }

        thread.titleFont = {
            color, bold, italic, lineThrough, style
        }
    }
    delete thread.titlefont
    delete thread.topic_misc
};

const setTimestamp = (obj, srcKey, destKey) => {
    if (!obj.hasOwnProperty('timestamp')) {
        obj.timestamp = {}
    }
    if (obj.hasOwnProperty(srcKey)) {
        obj.timestamp[destKey] = {
            time: obj[srcKey],
            value: second2String(obj[srcKey])
        }
        delete obj[srcKey]
    }
}

const handleTime = obj => {
    setTimestamp(obj, 'lastmodify', 'lastModify')
    setTimestamp(obj, 'lastpost', 'lastPost')
    setTimestamp(obj, 'postdate', 'post')
    setTimestamp(obj, 'regdate', 'reg');
    /*todo 疑似为上次登陆时间*/
    setTimestamp(obj, 'thisvisit', 'thisVisit');

};

const handleMirror = thread => {
    const {quote_from, quote_to, parent, topic_misc_var} = thread;
    thread.mirror = {}
    if (quote_from !== 0) {
        thread.mirror.from = quote_from
        thread.mirror.type = '镜像'
    }
    if (quote_to !== '') {
        thread.mirror.to = quote_to
        thread.mirror.type = '镜像源'
    }
    delete thread.quote_from
    delete thread.quote_to

//   版面镜像
    if (parent) {
        if (parent[0] === 635) {
            thread.mirror.fid = topic_misc_var['3']
            thread.mirror.type = '版面'
            delete thread.topic_misc_var
        } else if (parent[1]) {
            thread.mirror.type = '合集主题'
            thread.mirror.fid = parent[0];
            thread.mirror.stid = parent[1];
            thread.mirror.collection = parent[2];
        } else {
            thread.mirror.type = '子版主题'
            thread.mirror.fid = parent[0];
            thread.mirror.forum = parent[2];
        }
        delete thread.parent
    }
    if (topic_misc_var && topic_misc_var[1] === 33) {
        thread.mirror.type = '合集'
        delete thread.topic_misc_var
    }
    if (!thread.mirror.type) {
        delete thread.mirror
    }
};

const handleAuthor = thread => {
    const {author, authorid} = thread;
    thread.author = {
        name: author,
        id: authorid
    }
    delete thread.authorid;
};

const handleThreadType = thread => {
    thread.type = parseThreadTypeBit(thread.type)
};

const handleReplyInThread = thread => {
    const reply = thread.__P;
    if (reply) {
        setTimestamp(reply, 'postdate', 'post')
        const {authorid, content, pid, subject, timestamp} = reply
        thread.reply = {
            authorId: authorid,
            content, pid, subject, timestamp
        }
    }
    delete thread.__P
};

const handleSetInThread = thread => {
    const {__ST} = thread;
    if (__ST) {
        handleThread(__ST)
        thread.subForum = __ST;
    }
    delete thread.__ST
};

const handleThread = thread => {
    //处理标题颜色
    handleColor(thread);
    //处理时间戳
    handleTime(thread);
    //处理镜像字段
    handleMirror(thread);
    //处理作者信息
    handleAuthor(thread);
    //处理主题类型
    handleThreadType(thread);
    //处理搜索用户发言时主题下的回复
    handleReplyInThread(thread);
    //处理主题中的合集信息
    handleSetInThread(thread);

    delete thread.tpcurl;
};

const handleReply = reply => {
    handleThreadType(reply)

    const {postdatetimestamp, score, score_2, alterinfo, hotreply, from_client, comment, attachs} = reply

    // 时间戳
    const timestamp = {}
    timestamp.post = second2String(postdatetimestamp)
    reply.timestamp = timestamp
    delete reply.postdatetimestamp;
    delete reply.postdate;
    //楼层
    reply.level = reply.lou
    delete reply.lou;
    // 赞踩
    reply.score = {
        agree: score,
        disagree: score_2
    }
    delete reply.score_2;

    // 改动记录
    if (alterinfo && alterinfo.length > 0) {
        const operationLog = []
        alterinfo.split("]")
            .filter(s => s !== '')
            .map(s => s.replace("[", ""))
            .map(s => {
                return {
                    type: s[0],
                    data: s.substring(1).split(" ")
                }
            })
            .forEach(log => {
                if (log.type === "E") {
                    // 编辑记录
                    timestamp.edit = second2String(log.data[0])
                }
                if (log.type === "L") {
                    // 禁言
                    operationLog.push({
                        //L6 0 0 300 20 引战/转进/AOE
                        type: "禁言",
                        days: log.data[0],
                        fid: log.data[1],
                        reputation: log.data[3] * (-1),
                        rvrc: log.data[4] / 10 * (-1),
                        reason: log.data[5],
                    })
                }
                if (log.type === "U") {
                    // 取消操作
                    operationLog.push({
                        // [U0 0 0 UB105]
                        type: "取消操作",
                        days: log.data[0],
                        reputation: log.data[1],
                        rvrc: log.data[2] / 10,
                    })
                }
            })
        if (operationLog.length > 0) {
            reply.operationLog = operationLog;
        }

    }
    delete reply.alterinfo

    // 设备
    if (from_client && from_client.length > 0) {
        let s = from_client.split(" ");
        switch (s[0]) {
            case "0" :
                reply.client = 'PC';
                break;
            case "7" :
                reply.client = '苹果';
                break;
            case "8" :
                reply.client = '安卓';
                break;
            default:
                reply.client = s[1];
        }
        delete reply.from_client
    }

    // 附件
    if (attachs) {
        //ext 的可能项为 jpg png gif mp4 mp3 zip
        reply.attachs = obj2Array(attachs)
            .map(i => {
                const {attachurl, dscp, ext, size, url_utf8_org_name} = i;
                let type = '其他';
                if (["jpg", "png", "gif"].includes(ext)) {
                    type = '图片'
                }
                if (["mp4", "mp3"].includes(ext)) {
                    type = '媒体'
                }
                if ('zip' === ext) {
                    type = '压缩包'
                }
                return {
                    url: attachurl,
                    dsc: dscp,
                    name: decodeURI(url_utf8_org_name),
                    ext, size, type,
                }
            })
    }

    // 热评
    if (hotreply) {
        const hotReply = obj2Array(hotreply)
        hotReply.forEach(r => handleReply(r))
        reply.hotReply = hotReply;
        delete reply.hotreply
        delete reply.hotreply_id
    }
    // 贴条
    if (comment) {
        const a = obj2Array(comment)
        a.forEach(r => handleReply(r))
        reply.comment = a;
        delete reply.comment_id
    }


};

function handleUserData(__U, data) {
    const {__GROUPS, __MEDALS, __REPUTATIONS} = __U
    // console.log(__U)
    //用户组
    const groups = {}
    obj2Array(__GROUPS).forEach(i => {
        groups[i[2]] = i[0]
    })
    // console.log(groups)
    delete __U.__GROUPS

    // 徽章
    const medals = {}
    if (__MEDALS) {
        obj2Array(__MEDALS).forEach(i => {
            medals[i[3]] = {
                // 地址： https://img4.nga.178.com/ngabbs/medal/{filename}
                id:i[3],
                filename: i[0],
                name: i[1],
                dsc: i[2]
            }
        })
        delete __U.__MEDALS
    }

    //声望等级
    const reputations = {}
    const level = data.forum.reputationLevel
    Object.keys(__REPUTATIONS).forEach(key => {
        reputations[key] = {}
        const item = __REPUTATIONS[key]
        const rName = item[0]
        delete item[0]
        Object.keys(item).forEach(uid => {
            const value = item[uid];
            let name;
            for (let i = 0; i < level.length; i++) {
                if (value >= level[i].r) {
                    name = level[i].n
                    break;
                }
            }

            reputations[key][uid] = {
                name, value, rName
            };
        })
    })
    delete __U.__REPUTATIONS

    //用户
    const users = obj2Array(__U)

    //用户数据 整合：徽章、用户组、声望数据

    users.forEach(user => {
        //    用户组
        user.groupName = groups[user.memberid]
        user.groupId = user.memberid
        delete user.memberid;
        delete user.groupid;
        //    徽章
        if (user.medal.length > 0) {
            user.medals = user.medal.split(",")
                // .map(i => medals[i])
        }
        delete user.medal;
        //    声望

        const data = obj2Array(reputations)[0]
        user.reputation = data[user.uid]

        //    金币
        let money = user.money
        if (money && money > 0) {
            const copper = money % 100
            money -= copper;
            money /= 100;
            const silver = money % 100
            money -= silver;
            money /= 100;
            const gold = money
            user.money = {
                gold, silver, copper
            }
        }
        //回复数
        user.postCount = user.postnum;
        delete user.postnum;

        handleTime(user)
        //个人版面
        if (user.site) {
            user.personalForum = {
                fid: -1 * user.uid,
                name: user.site
            }
            delete user.site;
        }
        // 威望
        user.rvrc /= 10

        let avatar = user.avatar
        if (avatar && avatar.length > 0) {
            const prefix = 'https://img.nga.178.com/avatars'
            // noinspection HttpUrlsUsage
            const prefix1 = 'http://img.nga.178.com/avatars'
            if (avatar.startsWith(prefix) || avatar.startsWith(prefix1)) {
                avatar = avatar.replace(prefix, "").replace(prefix1, "")
                avatar = avatar.replace(/\.a\//g, "").replace(/\?\d+/g, "")
                const p = avatar.substring(0, avatar.lastIndexOf('/') + 1)
                user.avatar = {
                    prefix,
                    middlePart: p,
                    files: avatar.substring(avatar.lastIndexOf('/') + 1).split("|")
                }

            } else {
                console.log(`未识别的头像链接格式：` + avatar)
            }
        }
    })


    data.userData = {
        groups, medals, reputations, users
    }
    delete data.__U
}

// 对返回值进行预处理
const transformResponse = [
    //读取响应内容
    (data) => {
        let reader = new FileReader();
        reader.readAsText(data, 'GBK');
        return new Promise((resolve) => {
            reader.onload = () => {
                resolve(reader.result)
            }
        })
    },
    //删除多余字符
    (data) => {
        return data.then(res => {
            //格式规范化
            while (res.includes("	")) {
                res = res.replace("	", "")
            }
            while (res.includes("\t")) {
                res = res.replace("\t", "")
            }
            return res;
        })
    },
    //对提醒消息特殊处理
    (data) => {
        return data.then(result => {
            if (result.includes("unread")) {
                let r1 = /\s\d{1,2}:/g;
                let r2 = /,\d{1,2}:/g;
                let res
                while (res = r1.exec(result)) {
                    let startIndex = res.index
                    let endIndex = startIndex + res[0].indexOf(":")
                    result = result.substring(0, startIndex)
                        + `"` + result.substring(startIndex, endIndex).trim()
                        + `"` + result.substring(endIndex)
                }
                while (res = r2.exec(result)) {
                    let startIndex = res.index
                    let endIndex = startIndex + res[0].indexOf(":")
                    startIndex++
                    result = result.substring(0, startIndex)
                        + `"` + result.substring(startIndex, endIndex).trim()
                        + `"` + result.substring(endIndex)
                }
                return result
            }
            return result
        })
    },
    //解析为json对象
    (data) => {
        return data.then(res => {
            return JSON.parse(res)
        })
    },
    (data) => {
        return data.then(res => {
            const {error, data, time} = res;
            return {
                error, data, time,
                timestamp: second2String(time)
            }
        })
    },
    (data) => {
        // noinspection JSUnresolvedVariable
        return data.then(res => {
            // console.log(copyObj(res))
            const {error, data, time} = res;
            const {__CU, __F, __PAGE, __R, __ROWS, __T, __U, __T__ROWS_PAGE, __R__ROWS_PAGE} = data;

            //整理子版面
            if (__F) {
                const {fid, name, sub_forums, topped_topic, custom_level, set_topic_tid, set_topic_subject} = __F;
                const toppedTid = set_topic_tid ? set_topic_tid : topped_topic
                const children = []
                if (sub_forums) {
                    Object.keys(sub_forums).forEach(key => {
                        if (key.startsWith("t")) {
                            //   主题合集
                            children.push({type: "合集", name: sub_forums[key]["1"], stid: sub_forums[key]["0"]})
                        }
                        if (!isNaN(key)) {
                            //   子版面
                            children.push({type: "版面", name: sub_forums[key]["1"], fid: sub_forums[key]["0"]})
                        }
                    })
                }
                //声望等级
                let reputationLevel = []
                if (custom_level) {
                    let s = "" + custom_level;
                    while (s.includes("r:")) {
                        s = s.replace("r:", "\"r\":")
                    }
                    while (s.includes("n:")) {
                        s = s.replace("n:", "\"n\":")
                    }
                    reputationLevel = JSON.parse(s).reverse()
                }

                const forum = {fid, name, toppedTid}
                if (set_topic_subject) {
                    forum.setName = set_topic_subject;
                }
                if (reputationLevel && reputationLevel.length > 0) {
                    forum.reputationLevel = reputationLevel;
                }
                if (children && children.length > 0) {
                    forum.children = children;
                }

                delete data.__F
                data.forum = forum;
            }

            //整理当前用户
            if (__CU) {
                const {rvrc, uid} = __CU
                const currentUser = {uid, rvrc: rvrc / 10}
                delete data.__CU
                data.currentUser = currentUser;
            }

            //分页情况
            const total = __ROWS
            const pageSize = __T__ROWS_PAGE ? __T__ROWS_PAGE : __R__ROWS_PAGE
            const currentPage = __PAGE ? __PAGE : 1;
            if (total) {
                data.pageData = {total, pageSize, currentPage}
            }

            delete data.__ROWS
            delete data.__PAGE
            delete data.__T__ROWS_PAGE
            delete data.__R__ROWS_PAGE
            delete data.__T__ROWS
            delete data.__R__ROWS

            //主题数据
            if (__T) {
                if (!__T.tid) {
                    //主题列表
                    const threads = obj2Array(__T);
                    // console.log(threads)
                    threads.forEach(thread => {
                        //    处理单个主题数据
                        handleThread(thread);
                    })
                    data.threads = threads;
                } else {
                    // 主题详情
                    data.thread = copyObj(__T)
                    handleThread(data.thread);
                }
            }
            delete data.__T

            // 处理用户
            if (__U) {
                handleUserData(__U, data);
            }

            //处理回复列表
            if (__R) {
                const replies = obj2Array(__R)
                // console.log(replies)
                replies.forEach(reply => handleReply(reply))
                data.replies = replies;
                delete data.__R
            }

            delete data.__GLOBAL
            return res
        })
    },
    (data) => {
        return data.then(res => {
            const nukeData = res.data["0"];
            if (nukeData) {
                if (nukeData.hasOwnProperty('unread')) {
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
                } else if (nukeData.uid) {
                    //    用户信息
                    const {group,groupid,medal,more_info,regdate,uid} = nukeData
                    const user = {
                        uid,
                        groupId:groupid,
                        groupName:group,
                        medals:medal.split(","),
                        timestamp:{
                            reg:{time:regdate,value:second2String(regdate)}
                        },
                    }
                    //总赞数
                    const a = obj2Array(more_info).filter(i=>i.type===8)[0]
                    if (a){
                        user.totalAgreement = a.data
                    }

                    res.data.user = user;
                } else {
                    //    收藏版面
                    /*todo*/
                }
                console.log(res.data)

            }

            return res;
        })
    },
]


//统一请求工具
export const requestUnity = axios.create({
    baseURL: "/nga-api/",
    timeout: 10000,
    method: "post",
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Cache-Control": "max-age=0",
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
        __output: 8,
        __inchst: "UTF8",
    },
    responseType: 'blob',
    transformRequest,
    transformResponse,

})


requestUnity.interceptors.response.use(response => response.data, (error) => Promise.reject(error));

/**
 * 规范的 thread请求
 * @param page 页码
 * @param fid 版面
 * @param stid 合集
 * @param key  搜索关键字
 * @param authorid  作者uid
 * @param favor 是否为 我的收藏主题
 * @param orderByPostDateDesc 是否 按发布时间倒序
 * @param content 是否搜索主楼正文部分
 * @param recommend 是否仅显示精华帖
 * @param searchpost 含有authorid 时 是否搜索该用户回复
 * @returns {AxiosPromise} Promise
 */
const threadRequest = ({
                           page = 1,
                           fid,
                           stid,
                           key,
                           authorid,
                           favor = false,
                           recommend = false,
                           orderByPostDateDesc = false,
                           content = false,
                           searchpost = false,
                       }) => {
    // 初始值中 要么为空 要么一定有特定值
    const data = {page}
    //以下为值仅为 是 / 否 的字段
    if (stid) {
        data.stid = stid
    } else if (fid) {
        data.fid = fid
    }
    if (key) {
        data.key = key
    }
    if (authorid) {
        data.authorid = authorid
    }
    if (recommend) {
        data.recommend = 1
    }
    if (searchpost) {
        data.searchpost = 1
    }
    if (favor) {
        data.favor = 1
    }
    if (content) {
        data.content = 1
    }
    if (orderByPostDateDesc) {
        // noinspection SpellCheckingInspection
        data.order_by = "postdatedesc"
    }
    return requestUnity({
        url: "thread.php",
        data
    })
}

/*
* 浏览：版面（是否精华）、合集
* 搜索：
*   关键字：版面（是否精华）、合集
*   用户发言：主题、回复
* */

//搜索版面主题
export const searchInThread = ({page, key, fid, recommend, content}) => {
    return threadRequest({page, key, fid, recommend, content})
}
//搜索合集主题
export const searchInSet = ({page, key, stid, content}) => {
    return threadRequest({page, key, stid, content})
}
//搜索用户发言
export const searchByUser = ({page, fid, authorid, searchpost}) => {
    return threadRequest({page, fid, authorid, searchpost})
}
//浏览版面
export const threadByForum = ({page, fid, orderByPostDateDesc, recommend}) => {
    return threadRequest({page, fid, orderByPostDateDesc, recommend})
}
//浏览合集
export const threadBySet = ({page, stid, orderByPostDateDesc}) => {
    return threadRequest({page, stid, orderByPostDateDesc})
}

export const readRequest = ({pid, tid, page, authorid}) => {
    if (pid) {
        return requestUnity({
            url: "read.php",
            data: {pid}
        })
    }
    return requestUnity({
        url: "read.php",
        data: {tid, page, authorid}
    })
}

export const nukeRequest = (data) => {
    return requestUnity({
        url: "nuke.php",
        data
    })
}