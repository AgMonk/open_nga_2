// 置顶相关操作

import {nukeRequest} from "@/assets/request/nuke-request";

// 设置/取消 普通置顶
export const setTopicTop = (tid, top = true) => nukeRequest({
    __lib: "topic_top",
    __act: "set",
    level: top ? 1 : 0,
    tid,
    opt: 48,
    raw: 3,
})

export const getTopicTop = (fid) => nukeRequest({
    __lib: "topic_top",
    __act: "get_topic_top",
    fid,
    raw: 3,
})
