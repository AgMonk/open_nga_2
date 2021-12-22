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
            if (data.hasOwnProperty(key)) {
                const k = encodeURIComponent(key)
                const v = encodeURIComponent(data[key])
                a.push(`${k}=${v}`)
            }
        }
        return a.join("&")
    },
    (data) => {
        console.log(data)
        return data
    },
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

const handleTime = thread => {
    const {lastmodify, lastpost, postdate} = thread;
    const lastModify = second2String(lastmodify)
    const lastPost = second2String(lastpost)
    const post = second2String(postdate)
    thread.timestamp = {
        post, lastPost, lastModify
    }
    delete thread.lastmodify
    delete thread.lastpost
    delete thread.postdate
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

    delete thread.tpcurl;
};

const handleReply = reply => {
    handleAuthor(reply)
    handleThreadType(reply)

    const {postdatetimestamp, score, score_2, alterinfo} = reply
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
    if (alterinfo.length > 0) {
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
};

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
        return data.then(res => {
            if (res.includes("unread")) {
                let r1 = /\s\d{1,2}:/g;
                let r2 = /,\d{1,2}:/g;
                let res
                while (res = r1.exec(res)) {
                    let startIndex = res.index
                    let endIndex = startIndex + res[0].indexOf(":")
                    res = res.substring(0, startIndex)
                        + `"` + res.substring(startIndex, endIndex).trim()
                        + `"` + res.substring(endIndex)
                }
                while (res = r2.exec(res)) {
                    let startIndex = res.index
                    let endIndex = startIndex + res[0].indexOf(":")
                    startIndex++
                    res = res.substring(0, startIndex)
                        + `"` + res.substring(startIndex, endIndex).trim()
                        + `"` + res.substring(endIndex)
                }
            }
            return res
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
        return data.then(res => {
            const {error, data, time} = res;
            const {__CU, __F, __PAGE, __R, __ROWS, __T, __U, __T__ROWS_PAGE, __R__ROWS_PAGE} = data;

            //整理子版面
            if (__F) {
                const {fid, name, sub_forums, topped_topic} = __F;
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
                const forum = {fid, name, children, toppedTid: topped_topic}
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
            data.total = __ROWS
            data.pageSize = __T__ROWS_PAGE ? __T__ROWS_PAGE : __R__ROWS_PAGE
            data.page = __PAGE;
            delete data.__ROWS
            delete data.__PAGE
            delete data.__T__ROWS_PAGE
            delete data.__R__ROWS_PAGE
            delete data.__T__ROWS
            delete data.__R__ROWS

            //主题数据
            if (!__T.tid) {
                //主题列表
                const threads = obj2Array(__T);
                console.log(threads)
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
            delete data.__T

            //处理回复列表
            if (__R) {
                const replies = obj2Array(__R)
                console.log(replies)
                replies.forEach(reply => handleReply(reply))
                data.replies = replies;
                delete data.__R
            }


            return res
        })
    }
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
