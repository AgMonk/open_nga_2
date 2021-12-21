import axios from "axios";
import {second2String} from "@/assets/utils/DateFormat";
import {obj2Array} from "@/assets/utils/ObjectUtils";
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
    const {quote_from, quote_to} = thread;
    thread.mirror = {}
    if (quote_from !== 0){
        thread.mirror.from = quote_from
    }
    if (quote_to !== ''){
        thread.mirror.to = quote_to
    }
    delete thread.quote_from
    delete thread.quote_to
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
            delete data.__ROWS
            data.pageSize = __T__ROWS_PAGE ? __T__ROWS_PAGE : __R__ROWS_PAGE
            delete data.__T__ROWS_PAGE
            delete data.__R__ROWS_PAGE
            delete data.__T__ROWS

            //主题数据
            const threads = obj2Array(__T);
            console.log(threads)
            threads.forEach(thread => {
                //    处理单个主题数据
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
            })

            if (threads.length === 1) {
                data.thread = threads[0]
            } else {
                data.threads = threads
            }
            delete data.__T

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
