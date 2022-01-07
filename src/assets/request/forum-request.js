import {obj2Array} from "@/assets/utils/ObjectUtils";
import {requestUnity} from "@/assets/request/nga-request";
import {nukeRequest} from "@/assets/request/nuke-request";

//查询版面
export const forumRequest = ({key, page=1}) => {
    return requestUnity({
        url: "forum.php",
        data: {key, page},
    }).then(res => {
        if (typeof res.data !== 'object') {
            return []
        }

        res.data = obj2Array(res.data).filter(i => !i.error)
        res.data.forEach(f => {
            delete f.url;
            delete f.descrip;
            delete f._fid;
            const parent = f.parent
            if (parent) {
                delete parent.descrip;
            }
            if (f.stid) {
                delete f.fid
            }
        })
        return res.data;
    })
}

//关注子版 或 合集
export const followTid = (id, fid) => nukeRequest({
    __lib: "user_option"
    , __act: "set"
    , raw: 3
    , del: id
    , fid
    , type: 1
    , info: "add_to_block_tids"
})
//取关子版 或 合集
export const unfollowTid = (id, fid) => nukeRequest({
    __lib: "user_option"
    , __act: "set"
    , raw: 3
    , add: id
    , fid
    , type: 1
    , info: "add_to_block_tids"
})

// 查询子版状态
export const getFollowTid = (fid) => nukeRequest({
    __lib: "user_option"
    , __act: "get"
    , raw: 3
    , fid
    , type: 1
    , info: "add_to_block_tids"
}).then(res => {
    const {union_fid, block_tid} = res.data['0']
    return {
        unionFid: obj2Array(union_fid),
        blockTid: obj2Array(block_tid),
    }
})
