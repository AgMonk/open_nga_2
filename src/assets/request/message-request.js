import {obj2Array} from "@/assets/utils/ObjectUtils";
import {second2String} from "@/assets/utils/DateFormat";
import {parseBitData} from "@/assets/request/bitUtils";
import {nukeRequest} from "@/assets/request/nuke-request";
import {handleUserData} from "@/assets/request/nga-request";
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
            const {bit, from, from_username, last_from, last_from_username, last_modify, mid, posts, subject, time} = data
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

//阅读消息
export const readMessage = (mid, page = 1) => nukeRequest({
    __lib: "message"
    , __act: "message"
    , act: "read"
    , page, mid
}).then(res => {
    const {data} = res;
    const {currentPage, length, nextPage, subjectBit, userInfo} = data['0']
    const bitData = subjectBit ? parseBitData(subjectBit) : "0";
    const [multiUsers, unread] = bitData.split('').map(i => i === '1');
    const pageData = {
        pageSize: length,
        hasNext: nextPage === 1,
        currentPage,
    }
    const subjectStatus = {multiUsers, unread}

    const replies = Object.keys(data['0']).filter(i => !isNaN(i)).map(i => data['0'][i])

    const userData = {}
    handleUserData(userInfo, userData)
    userData.userData.users.forEach(user => {
        Object.keys(user).forEach(key => {
            if (user[key] === '') {
                delete user[key]
            }
        })
    })

    res.data = {pageData, subjectStatus, replies, userData: userData.userData}

    return res;
})

//回复短消息
export const replyMessage = (mid, content, subject) => nukeRequest({
    __lib: "message"
    , __act: "message"
    , act: "reply"
    , mid, content, subject
}).then(res => res.data)